import { Inject, Injectable } from '@nestjs/common';
import { IGetAllActiveFixturesUseCase } from '../ports/use-cases/get-all-active-fixtures.use-case.interface';
import { IFixtureRepository } from '../ports/repositories/fixture-repository.interface';
import { Fixture } from '../../domain/fixture.entity';

@Injectable()
export class GetAllActiveFixturesUseCase implements IGetAllActiveFixturesUseCase {
  constructor(
    @Inject('IFixtureRepository')
    private readonly _fixtureRepository: IFixtureRepository,
  ) {}

  async execute(tenantId: string): Promise<Fixture[]> {
    return this._fixtureRepository.findAllActive(tenantId);
  }
}
