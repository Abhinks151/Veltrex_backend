export interface IUpdateRawMaterialStockUseCase {
  execute(id: string, quantityDelta: number): Promise<void>;
}
