import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { Fixture } from '../../domain/fixture.entity';
import { IFixtureRepository } from '../ports/repositories/fixture-repository.interface';
import { IListFixturesUseCase } from '../ports/use-cases/list-fixtures.use-case.interface';

@Injectable()
export class ListFixturesUseCase implements IListFixturesUseCase {
  constructor(
    @Inject('IFixtureRepository')
    private readonly _fixtureRepository: IFixtureRepository,
  ) {}

  async execute(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ fixtures: Fixture[]; total: number }> {
    return await this._fixtureRepository.findAllPaginated(tenantId, query);
  }
}
