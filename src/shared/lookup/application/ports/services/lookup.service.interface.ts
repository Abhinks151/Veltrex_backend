import { Lookup } from '../../../domain/lookup.entity';

export interface ILookupService {
  getByCategory(category: string, tenantId?: string): Promise<Lookup[]>;
  getAll(tenantId?: string): Promise<Record<string, Lookup[]>>;
}
