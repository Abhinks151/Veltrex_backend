import { Fixture } from '../../domain/fixture.entity';
import { FixtureType } from '@/shared/enums/fixture-type.enum';

export interface RawFixture {
  id: string;
  tenantId: string;
  name: string;
  dimensions: unknown;
  type: string;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toFixtureMapper = (fixture: RawFixture): Fixture => {
  return new Fixture(
    fixture.id,
    fixture.tenantId,
    fixture.name,
    fixture.dimensions as object,
    fixture.type as FixtureType,
    fixture.isBlocked,
    fixture.isDeleted,
    fixture.createdAt,
    fixture.updatedAt,
  );
};
