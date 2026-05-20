import { Fixture } from '@/modules/fixture/domain/fixture.entity';

export interface IDeleteFixtureUseCase {
  execute(id: string): Promise<Fixture>;
}
