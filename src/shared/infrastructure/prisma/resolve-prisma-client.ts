import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import {
  PrismaTransactionContext,
  PrismaTxClient,
} from './prisma-transaction-context';
import { PrismaService } from './prisma.service';

export function resolvePrismaClient(
  prisma: PrismaService,
  ctx?: ITransactionContext,
): PrismaTxClient {
  if (ctx instanceof PrismaTransactionContext) {
    return ctx.tx;
  }
  return prisma;
}
