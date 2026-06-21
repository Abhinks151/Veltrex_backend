import { Inject, Injectable } from '@nestjs/common';
import { IPartRepository } from '../ports/repositories/part-repository.interface';
import { IDeletePartUseCase } from '../ports/use-cases/delete-part.use-case.interface';
import { Part } from '../../domain/part.entity';

@Injectable()
export class DeletePartUseCase implements IDeletePartUseCase {
  constructor(
    @Inject('IPartRepository')
    private readonly _partRepository: IPartRepository,
  ) {}

  async execute(id: string): Promise<Part> {
    return await this._partRepository.delete(id);
  }
}
