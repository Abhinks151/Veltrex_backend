export class RawMaterial {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly dimensions: object,
    public readonly material: string,
    public readonly minQty: number,
    public readonly currentQty: number,
    public readonly isBlocked: boolean,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
