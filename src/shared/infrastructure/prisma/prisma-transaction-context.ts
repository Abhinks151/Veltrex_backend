import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { PrismaClient } from '@prisma/client';

// Derive the tx client type Prisma exposes inside $transaction callbacks
export type PrismaTxClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0];

export class PrismaTransactionContext implements ITransactionContext {
  readonly id: symbol = Symbol('PrismaTransactionContext');

  constructor(public readonly tx: PrismaTxClient) {}
}
