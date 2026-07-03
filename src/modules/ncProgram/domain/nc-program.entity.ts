import { ProgramVersion } from './program-version.entity';

export class NcProgram {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly versions: ProgramVersion[] = [],
  ) {}
}
