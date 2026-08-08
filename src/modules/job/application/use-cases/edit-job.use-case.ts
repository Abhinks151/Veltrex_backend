import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IEditJobUseCase } from '../ports/use-cases/edit-job.use-case.interface';
import { IJobRepository } from '../ports/repositories/job-repository.interface';
import { ICheckRawMaterialAvailabilityUseCase } from '@/modules/raw-material/application/ports/use-cases/check-raw-material-availability.use-case.interface';
import { IUpdateRawMaterialStockUseCase } from '@/modules/raw-material/application/ports/use-cases/update-raw-material-stock.use-case.interface';
import { IGetPartByIdUseCase } from '@/modules/part/application/ports/use-cases/get-part-by-id.use-case.interface';
// import { IMachineRepository } from '@/modules/machine/application/ports/repositories/machine-repository.interface';
// import { MachineStatus } from '@/modules/machine/domain/machine-status.enum';
import { Job, JobStatus } from '../../domain/job.entity';
import { EditJobDto } from '../dto/edit-job.dto';
import {
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { Part } from '@/modules/part/domain/part.entity';
import { StockChange } from '../../domain';

@Injectable()
export class EditJobUseCase implements IEditJobUseCase {
  constructor(
    @Inject('IJobRepository')
    private readonly jobRepository: IJobRepository,

    @Inject('ICheckRawMaterialAvailabilityUseCase')
    private readonly checkRawMaterialAvailability: ICheckRawMaterialAvailabilityUseCase,

    @Inject('IUpdateRawMaterialStockUseCase')
    private readonly updateRawMaterialStock: IUpdateRawMaterialStockUseCase,

    @Inject('IGetPartByIdUseCase')
    private readonly getPartByIdUseCase: IGetPartByIdUseCase,
  ) {}

  async execute(id: string, dto: EditJobDto): Promise<Job> {
    const job = await this.getJob(id);

    this.validateUpdate(job, dto);

    const oldPart = await this.getPartByIdUseCase.execute(job.partId);

    const newPartId = dto.partId ?? job.partId;

    const newPart =
      newPartId === job.partId
        ? oldPart
        : await this.getPartByIdUseCase.execute(newPartId);

    const newQuantity = dto.quantity ?? job.quantity;

    const stockChanges = this.calculateStockChanges(
      oldPart,
      job.quantity,
      newPart,
      newQuantity,
    );

    await this.validateStockChanges(stockChanges);

    await this.applyStockChanges(stockChanges);

    const updateData = this.buildUpdateData(dto);

    try {
      return await this.jobRepository.update(id, updateData);
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_JOB);
    }
  }

  private async getJob(id: string): Promise<Job> {
    const job = await this.jobRepository.findById(id);

    if (!job) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.JOB_NOT_FOUND);
    }

    return job;
  }

  private validateUpdate(job: Job, dto: EditJobDto): void {
    if (dto.quantity === undefined) {
      return;
    }

    if (dto.quantity === job.quantity) {
      return;
    }

    const lockedStatus =
      job.status === JobStatus.IN_PROGRESS ||
      job.status === JobStatus.COMPLETED;

    if (lockedStatus) {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR
          .CANNOT_UPDATE_QUANTITY_WHEN_JOB_IS_IN_PROGRESS_OR_COMPLETED,
      );
    }
  }

  private calculateStockChanges(
    oldPart: Part,
    oldQuantity: number,
    newPart: Part,
    newQuantity: number,
  ): StockChange[] {
    const changes = new Map<string, number>();

    if (oldPart.rawMaterialId) {
      this.addStockChange(changes, oldPart.rawMaterialId, oldQuantity);
    }

    if (newPart.rawMaterialId) {
      this.addStockChange(changes, newPart.rawMaterialId, -newQuantity);
    }

    return [...changes.entries()]
      .filter(([, quantity]) => quantity !== 0)
      .map(([rawMaterialId, quantity]) => ({
        rawMaterialId,
        quantity,
      }));
  }

  private addStockChange(
    changes: Map<string, number>,
    rawMaterialId: string,
    quantity: number,
  ): void {
    changes.set(rawMaterialId, (changes.get(rawMaterialId) ?? 0) + quantity);
  }

  private async validateStockChanges(changes: StockChange[]): Promise<void> {
    for (const change of changes) {
      if (change.quantity >= 0) {
        continue;
      }

      const requiredQuantity = Math.abs(change.quantity);

      const hasEnoughStock = await this.checkRawMaterialAvailability.execute(
        change.rawMaterialId,
        requiredQuantity,
      );

      if (!hasEnoughStock) {
        throw new BadRequestError(
          MESSAGE_CONSTANTS.ERROR.INSUFFICIENT_RAW_MATERIAL,
        );
      }
    }
  }

  private async applyStockChanges(changes: StockChange[]): Promise<void> {
    for (const change of changes) {
      await this.updateRawMaterialStock.execute(
        change.rawMaterialId,
        change.quantity,
      );
    }
  }

  private buildUpdateData(dto: EditJobDto): Prisma.JobUpdateInput {
    const { partId, ...data } = dto;

    return {
      ...data,
      ...(partId && {
        part: {
          connect: {
            id: partId,
          },
        },
      }),
    };
  }
}
