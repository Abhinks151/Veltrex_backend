// Opaque handle passed from TransactionManager to repositories.
// Application layer never imports Prisma — it only knows this interface.
export interface ITransactionContext {
  readonly id: symbol;
}
