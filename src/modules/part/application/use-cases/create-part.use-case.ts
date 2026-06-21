import { Inject, Injectable } from '@nestjs/common';
import { IPartRepository } from '../ports/repositories/part-repository.interface';
import { ICreatePartUseCase } from '../ports/use-cases/create-part.use-case.interface';
import { CreatePartDto } from '../dto/create-part.dto';
import { Part } from '../../domain/part.entity';

@Injectable()
export class CreatePartUseCase implements ICreatePartUseCase {
  constructor(
    @Inject('IPartRepository')
    private readonly _partRepository: IPartRepository,
  ) {}

  async execute(data: CreatePartDto): Promise<Part> {
    return await this._partRepository.create(data);
  }
}
