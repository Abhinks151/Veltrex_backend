import { Inject, Injectable } from '@nestjs/common';
import { IEditFixtureUseCase } from '../ports/use-cases/edit-fixture.use-case.interface';
import { IFixtureRepository } from '../ports/repositories/fixture-repository.interface';
import { Fixture } from '../../domain/fixture.entity';
import { FixtureInputDto } from '../dto/create-fixture.dto';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class EditFixtureUseCase implements IEditFixtureUseCase {
  constructor(
    @Inject('IFixtureRepository')
    private readonly _fixtureRepository: IFixtureRepository,
  ) {}

  async execute(id: string, dto: FixtureInputDto): Promise<Fixture> {
    const existing = await this._fixtureRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.FIXTURE_NOT_FOUND);
    }

    if (dto.name) {
      const nameConflict = await this._fixtureRepository.findByTenantAndName(
        existing.tenantId,
        dto.name,
      );
      if (nameConflict && nameConflict.id !== id) {
        throw new ConflictError(MESSAGE_CONSTANTS.ERROR.FIXTURE_NAME_TAKEN);
      }
    }

    try {
      return await this._fixtureRepository.update(id, dto);
    } catch {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_FIXTURE,
      );
    }
  }
}
