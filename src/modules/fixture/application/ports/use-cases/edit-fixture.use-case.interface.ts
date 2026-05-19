import { Fixture } from '@/modules/fixture/domain/fixture.entity';
import { FixtureInputDto } from '../../dto/create-fixture.dto';

export interface IEditFixtureUseCase {
  execute(id: string, dto: FixtureInputDto): Promise<Fixture>;
}
