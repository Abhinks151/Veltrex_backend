import { Inject, Injectable } from '@nestjs/common';
import { IPartRepository } from '../ports/repositories/part-repository.interface';
import { IGetAllActivePartsUseCase } from '../ports/use-cases/get-all-active-parts.use-case.interface';
import { Part } from '../../domain/part.entity';

@Injectable()
export class GetAllActivePartsUseCase implements IGetAllActivePartsUseCase {
  constructor(
    @Inject('IPartRepository')
    private readonly _partRepository: IPartRepository,
  ) {}

  async execute(tenantId: string): Promise<Part[]> {
    return await this._partRepository.findAllActive(tenantId);
  }
}
