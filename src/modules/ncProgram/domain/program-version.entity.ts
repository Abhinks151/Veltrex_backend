export class ProgramVersion {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly programId: string,
    public readonly versionNumber: number,
    public readonly fileUrl: string,
    public readonly fileName: string | null,
    public readonly fileSize: number | null,
    public readonly mimeType: string | null,
    public readonly description: string | null,
    public readonly createdBy: string,
    public readonly isBlocked: boolean,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
