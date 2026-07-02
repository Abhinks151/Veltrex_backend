import { Inject, Injectable } from '@nestjs/common';
import { IDeleteJobUseCase } from '../ports/use-cases/delete-job.use-case.interface';
import { IJobRepository } from '../ports/repositories/job-repository.interface';
import { IGetPartByIdUseCase } from '@/modules/part/application/ports/use-cases/get-part-by-id.use-case.interface';
import { IUpdateRawMaterialStockUseCase } from '@/modules/raw-material/application/ports/use-cases/update-raw-material-stock.use-case.interface';
import { Job } from '../../domain/job.entity';
import { BadRequestError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class DeleteJobUseCase implements IDeleteJobUseCase {
  constructor(
    @Inject('IJobRepository')
    private readonly _jobRepository: IJobRepository,
    @Inject('IGetPartByIdUseCase')
    private readonly _getPartByIdUseCase: IGetPartByIdUseCase,
    @Inject('IUpdateRawMaterialStockUseCase')
    private readonly _updateRawMaterialStock: IUpdateRawMaterialStockUseCase,
  ) {}

  async execute(id: string): Promise<Job> {
    const job = await this._jobRepository.findById(id);
    if (job) {
      try {
        const part = await this._getPartByIdUseCase.execute(job.partId);
        if (part && part.rawMaterialId) {
          await this._updateRawMaterialStock.execute(
            part.rawMaterialId,
            job.quantity,
          );
        }
      } catch {
        // If no part found, skip
      }
    }
    try {
      return await this._jobRepository.softDelete(id);
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_JOB);
    }
  }
}
