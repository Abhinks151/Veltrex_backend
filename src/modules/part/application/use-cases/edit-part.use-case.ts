import { Inject, Injectable } from '@nestjs/common';
import { IPartRepository } from '../ports/repositories/part-repository.interface';
import { IEditPartUseCase } from '../ports/use-cases/edit-part.use-case.interface';
import { Part } from '../../domain/part.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class EditPartUseCase implements IEditPartUseCase {
  constructor(
    @Inject('IPartRepository')
    private readonly _partRepository: IPartRepository,
  ) {}

  async execute(id: string, data: Prisma.PartUpdateInput): Promise<Part> {
    return await this._partRepository.update(id, data);
  }
}
