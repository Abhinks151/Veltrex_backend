export interface CreateRawMaterialDto {
  tenantId: string;
  name: string;
  dimensions: object;
  material: string;
  minQty: number;
  currentQty: number;
}
