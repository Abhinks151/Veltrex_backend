import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import {
  PrismaTransactionContext,
  PrismaTxClient,
} from './prisma-transaction-context';
import { PrismaService } from './prisma.service';

/**
 * Returns the Prisma tx client when inside a transaction,
 * or the main PrismaService client otherwise.
 * Call this at the start of every repository method that accepts ctx.
 */
export function resolvePrismaClient(
  prisma: PrismaService,
  ctx?: ITransactionContext,
): PrismaTxClient {
  if (ctx instanceof PrismaTransactionContext) {
    return ctx.tx;
  }
  return prisma;
}
