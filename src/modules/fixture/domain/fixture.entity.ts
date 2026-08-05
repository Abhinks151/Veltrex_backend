import { FixtureType } from '@/shared/enums/machining-type.enum';

export class Fixture {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly dimensions: object,
    public readonly type: FixtureType,
    public readonly isBlocked: boolean,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
