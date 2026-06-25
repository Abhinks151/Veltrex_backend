import { Inject, Injectable } from '@nestjs/common';
import { ILookupService } from '../ports/services/lookup.service.interface';
import { ILookupRepository } from '../ports/repositories/lookup-repository.interface';
import { Lookup } from '../../domain/lookup.entity';

@Injectable()
export class LookupService implements ILookupService {
  constructor(
    @Inject('ILookupRepository')
    private readonly lookupRepository: ILookupRepository,
  ) {}

  async getByCategory(category: string, tenantId?: string) {
    return this.lookupRepository.findByCategory(category, tenantId);
  }

  async getAll(tenantId?: string) {
    const lookups = await this.lookupRepository.findAllActive(tenantId);

    return lookups.reduce(
      (acc, lookup) => {
        if (!acc[lookup.category]) {
          acc[lookup.category] = [];
        }
        acc[lookup.category].push(lookup);
        return acc;
      },
      {} as Record<string, Lookup[]>,
    );
  }
}
