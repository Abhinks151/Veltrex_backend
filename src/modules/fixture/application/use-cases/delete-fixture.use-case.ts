import { Inject, Injectable } from '@nestjs/common';
import { IDeleteFixtureUseCase } from '../ports/use-cases/delete-fixture.use-case.interface';
import { IFixtureRepository } from '../ports/repositories/fixture-repository.interface';
import { Fixture } from '../../domain/fixture.entity';
import {
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class DeleteFixtureUseCase implements IDeleteFixtureUseCase {
  constructor(
    @Inject('IFixtureRepository')
    private readonly _fixtureRepository: IFixtureRepository,
  ) {}

  async execute(id: string): Promise<Fixture> {
    const existing = await this._fixtureRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.FIXTURE_NOT_FOUND);
    }

    if (existing.isDeleted) {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FIXTURE_ALREADY_DELETED,
      );
    }

    try {
      return await this._fixtureRepository.softDelete(id);
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.INTERNAL_SERVER_ERROR);
    }
  }
}
