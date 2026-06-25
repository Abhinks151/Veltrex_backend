import { Lookup as PrismaLookup } from '@prisma/client';
import { Lookup } from '../../domain/lookup.entity';

export type RawLookup = PrismaLookup;

export const toLookupMapper = (raw: RawLookup): Lookup => {
  return new Lookup(
    raw.id,
    raw.category,
    raw.code,
    raw.label,
    raw.description,
    raw.value,
    raw.sortOrder,
    raw.metadata as Record<string, unknown> | null,
    raw.isActive,
    raw.tenantId,
    raw.createdAt,
    raw.updatedAt,
  );
};
