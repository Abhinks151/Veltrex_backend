import { Plan as PrismaPlan } from '@prisma/client';
import { Plan } from '../../domain/plan.entity';

export const toPlanMapper = (prismaPlan: PrismaPlan): Plan => {
  return new Plan(
    prismaPlan.id,
    prismaPlan.code,
    prismaPlan.name,
    prismaPlan.description,
    Number(prismaPlan.price),
    prismaPlan.currency,
    prismaPlan.durationDays,
    prismaPlan.isBlocked,
    prismaPlan.isDeleted,
    prismaPlan.createdAt,
    prismaPlan.updatedAt,
  );
};
