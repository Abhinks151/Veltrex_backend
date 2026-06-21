export class Part {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly partNumber: string,
    public readonly description: string | null,
    public readonly setupSheet: string | null,
    public readonly engineeringDrawing: string | null,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
