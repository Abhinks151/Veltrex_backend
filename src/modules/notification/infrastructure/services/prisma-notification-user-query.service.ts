import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { INotificationUserQueryService } from '../../application/ports/services/notification-user-query.service.interface';
import { Role } from '@/shared/enums';

@Injectable()
export class PrismaNotificationUserQueryService implements INotificationUserQueryService {
  constructor(private readonly _prisma: PrismaService) {}

  async findUserIdsByTenantAndRoles(
    tenantId: string,
    roles: string[],
  ): Promise<string[]> {
    const rolesFilterAsEnum = roles as Role[];
    const roleFilter =
      rolesFilterAsEnum.length > 0 ? { role: { in: rolesFilterAsEnum } } : {};

    const users = await this._prisma.user.findMany({
      where: {
        isDeleted: false,
        isBlocked: false,
        OR: [
          { tenantId, ...roleFilter },
          { ownedTenant: { id: tenantId }, ...roleFilter },
        ],
      },
      select: { id: true },
    });

    return users.map((u) => u.id);
  }
}
