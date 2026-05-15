import { User } from '../../domain/entities/user.entity';
import { Role } from '@/shared/enums/roles.enum';
import { User as PrismaUser } from '@prisma/client';

export const toDomainUser = (user: PrismaUser): User => {
  const u = user as PrismaUser & {
    profileImage?: string;
    profileImageKey?: string;
  };
  return new User(
    u.id,
    u.name,
    u.email,
    u.password,
    u.createdAt,
    u.updatedAt,
    u.role as Role,
    u.isVerified,
    u.isBlocked,
    u.isDeleted,
    u.profileImage ?? undefined,
    u.profileImageKey ?? undefined,
  );
};
