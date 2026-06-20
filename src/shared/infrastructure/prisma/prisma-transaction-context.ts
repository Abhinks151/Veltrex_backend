import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { PrismaClient } from '@prisma/client';

export type PrismaTxClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0];

export class PrismaTransactionContext implements ITransactionContext {
  // use as const other wise the type will the string(infered type)
  readonly type = 'transaction' as const;

  constructor(public readonly tx: PrismaTxClient) {}
}
