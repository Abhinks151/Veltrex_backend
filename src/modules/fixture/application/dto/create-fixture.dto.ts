import { FixtureType } from '@/shared/enums/fixture-type.enum';

export interface CreateFixtureDto {
  tenantId: string;
  name: string;
  dimensions: object;
  type: FixtureType;
}

export type FixtureInputDto = Partial<CreateFixtureDto>;
