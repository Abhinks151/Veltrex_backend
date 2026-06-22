import { Inject, Injectable } from '@nestjs/common';
import { ITenantMarkTrialAsUsedUseCase } from '../ports/use-cases/mark-trial-as-used.use-case.interface';
import { ITenantRepository } from '../ports/repositories/tenant-repository.interface';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';

@Injectable()
export class MarkTrialAsUsedUseCase implements ITenantMarkTrialAsUsedUseCase {
  constructor(
    @Inject('ITenantRepository')
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(tenantId: string, ctx?: ITransactionContext): Promise<void> {
    return await this._tenantRepository.markTrialAsUsed(tenantId, ctx);
  }
}
