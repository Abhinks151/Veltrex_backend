export class Lookup {
  constructor(
    public readonly id: string,
    public readonly category: string,
    public readonly code: string,
    public readonly label: string,
    public readonly description: string | null,
    public readonly value: string | null,
    public readonly sortOrder: number,
    public readonly metadata: Record<string, unknown> | null,
    public readonly isActive: boolean,
    public readonly tenantId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
