import { RawMaterial } from '../../domain/raw-material.entity';

export interface RawRawMaterial {
  id: string;
  tenantId: string;
  name: string;
  dimensions: unknown;
  material: string;
  minQty: number;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toRawMaterialMapper = (
  rawMaterial: RawRawMaterial,
): RawMaterial => {
  return new RawMaterial(
    rawMaterial.id,
    rawMaterial.tenantId,
    rawMaterial.name,
    rawMaterial.dimensions as object,
    rawMaterial.material,
    rawMaterial.minQty,
    rawMaterial.isBlocked,
    rawMaterial.isDeleted,
    rawMaterial.createdAt,
    rawMaterial.updatedAt,
  );
};
