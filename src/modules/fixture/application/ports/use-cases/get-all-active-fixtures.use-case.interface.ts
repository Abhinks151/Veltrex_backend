import { Fixture } from '@/modules/fixture/domain/fixture.entity';

export interface IGetAllActiveFixturesUseCase {
  execute(tenantId: string): Promise<Fixture[]>;
}
