import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';

export interface ITenantMarkTrialAsUsedUseCase {
  execute(tenantId: string, ctx?: ITransactionContext): Promise<void>;
}
