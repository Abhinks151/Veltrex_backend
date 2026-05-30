import { Injectable } from '@nestjs/common';
import { ITransactionManager } from '@/shared/application/ports/transaction-manager.interface';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { PrismaService } from './prisma.service';
import { PrismaTransactionContext } from './prisma-transaction-context';

@Injectable()
export class PrismaTransactionManager implements ITransactionManager {
  constructor(private readonly _prisma: PrismaService) {}

  async run<T>(work: (ctx: ITransactionContext) => Promise<T>): Promise<T> {
    return this._prisma.$transaction(async (tx) => {
      const ctx = new PrismaTransactionContext(tx);
      return work(ctx);
    });
  }
}
