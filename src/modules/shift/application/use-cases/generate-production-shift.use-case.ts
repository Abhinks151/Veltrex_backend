import { Inject, Injectable } from '@nestjs/common';
import { IGenerateProductionShiftUseCase } from '../ports/use-cases/generate-production-shift.use-case.interface';
import { IShiftTemplateRepository } from '../ports/repositories/shift-template-repository.interface';
import { IProductionShiftRepository } from '../ports/repositories/production-shift-repository.interface';
import { ShiftGeneratorService } from '../../infrastructure/services/shift-generator.service';
import { ProductionShift } from '../../domain/shift.entity';
import { ITransactionManager } from '@/shared/application/ports/transaction-manager.interface';
import { NotFoundError } from '@/shared/common/errors/domain-errors';

@Injectable()
export class GenerateProductionShiftUseCase implements IGenerateProductionShiftUseCase {
  constructor(
    @Inject('IShiftTemplateRepository')
    private readonly _shiftTemplateRepository: IShiftTemplateRepository,
    @Inject('IProductionShiftRepository')
    private readonly _productionShiftRepository: IProductionShiftRepository,
    @Inject('ITransactionManager')
    private readonly _txManager: ITransactionManager,
    private readonly _shiftGenerator: ShiftGeneratorService,
  ) {}

  async execute(
    templateId: string,
    tenantId: string,
    date: Date,
    createdByUserId: string,
  ): Promise<ProductionShift> {
    const template = await this._shiftTemplateRepository.findByTenantAndId(
      tenantId,
      templateId,
    );
    if (!template) {
      throw new NotFoundError('Shift template not found');
    }

    return this._txManager.run(async (ctx) => {
      const generated = await this._shiftGenerator.generateForTemplate(
        templateId,
        date,
        createdByUserId,
        ctx,
      );

      const fullShift = await this._productionShiftRepository.findByTenantAndId(
        tenantId,
        generated.id,
        ctx,
      );
      return fullShift!;
    });
  }
}
