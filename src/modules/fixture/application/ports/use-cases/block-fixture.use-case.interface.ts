import { Fixture } from '@/modules/fixture/domain/fixture.entity';

export interface IBlockFixtureUseCase {
  execute(id: string): Promise<Fixture>;
}
