import { Inject, Injectable } from '@nestjs/common';
import { ICreateFixtureUseCase } from '../ports/use-cases/create-fixture.use-case.interface';
import { IFixtureRepository } from '../ports/repositories/fixture-repository.interface';
import { Fixture } from '../../domain/fixture.entity';
import { CreateFixtureDto } from '../dto/create-fixture.dto';
import {
  BadRequestError,
  ConflictError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class CreateFixtureUseCase implements ICreateFixtureUseCase {
  constructor(
    @Inject('IFixtureRepository')
    private readonly _fixtureRepository: IFixtureRepository,
  ) {}

  async execute(dto: CreateFixtureDto): Promise<Fixture> {
    const existing = await this._fixtureRepository.findByTenantAndName(
      dto.tenantId,
      dto.name,
    );
    if (existing) {
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.FIXTURE_NAME_TAKEN);
    }

    try {
      return await this._fixtureRepository.create(dto);
    } catch {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_FIXTURE,
      );
    }
  }
}
