import { Inject, Injectable } from '@nestjs/common';
import { IBlockFixtureUseCase } from '../ports/use-cases/block-fixture.use-case.interface';
import { IFixtureRepository } from '../ports/repositories/fixture-repository.interface';
import { Fixture } from '../../domain/fixture.entity';
import {
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class BlockFixtureUseCase implements IBlockFixtureUseCase {
  constructor(
    @Inject('IFixtureRepository')
    private readonly _fixtureRepository: IFixtureRepository,
  ) {}

  async execute(id: string): Promise<Fixture> {
    const existing = await this._fixtureRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.FIXTURE_NOT_FOUND);
    }

    try {
      return await this._fixtureRepository.updateBlockStatus(
        id,
        !existing.isBlocked,
      );
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.INTERNAL_SERVER_ERROR);
    }
  }
}
