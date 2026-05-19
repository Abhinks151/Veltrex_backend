import { Fixture } from '@/modules/fixture/domain/fixture.entity';
import { CreateFixtureDto } from '../../dto/create-fixture.dto';

export interface ICreateFixtureUseCase {
  execute(dto: CreateFixtureDto): Promise<Fixture>;
}
