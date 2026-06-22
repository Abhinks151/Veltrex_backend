import { Inject, Injectable } from '@nestjs/common';
import { IDeleteFixtureUseCase } from '../ports/use-cases/delete-fixture.use-case.interface';
import { IFixtureRepository } from '../ports/repositories/fixture-repository.interface';
import { Fixture } from '../../domain/fixture.entity';
import {
  ConflictError,
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { ICheckResourceInUseUseCase } from '@/modules/part/application/ports/use-cases/check-resource-in-use.use-case.interface';

@Injectable()
export class DeleteFixtureUseCase implements IDeleteFixtureUseCase {
  constructor(
    @Inject('IFixtureRepository')
    private readonly _fixtureRepository: IFixtureRepository,
    @Inject('ICheckResourceInUseUseCase')
    private readonly _checkResourceInUseUseCase: ICheckResourceInUseUseCase,
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

    const isInUse = await this._checkResourceInUseUseCase.isFixtureInUse(id);

    if (isInUse) {
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.FIXTURE_IN_USE);
    }

    try {
      return await this._fixtureRepository.delete(id);
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.INTERNAL_SERVER_ERROR);
    }
  }
}
