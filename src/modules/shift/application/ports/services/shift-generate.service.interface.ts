import { ProductionShift } from '@/modules/shift/domain/shift.entity';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';

export interface IShiftGeneratorService {
  generateForTemplate(
    templateId: string,
    date: Date,
    createdByUserId: string | null,
    ctx?: ITransactionContext,
  ): Promise<ProductionShift>;
}
