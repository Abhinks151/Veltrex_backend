import { ITransactionContext } from './transaction-context.interface';

export interface ITransactionManager {
  run<T>(work: (ctx: ITransactionContext) => Promise<T>): Promise<T>;
}
