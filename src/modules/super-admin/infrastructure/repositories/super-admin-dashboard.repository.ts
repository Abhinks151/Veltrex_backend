import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { ISuperAdminDashboardRepository } from '../../application/ports/repositories/super-admin-dashboard.repository.interface';
import { BadRequestError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class SuperAdminDashboardRepository implements ISuperAdminDashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getTotalTenantsCount(): Promise<number> {
    try {
      return await this.prisma.tenant.count({
        where: { isDeleted: false },
      });
    } catch {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.TOTAL_TENANTS_COUNT_FAILED,
      );
    }
  }

  async getTenantsCreatedInRange(start: Date, end: Date): Promise<number> {
    try {
      return await this.prisma.tenant.count({
        where: {
          isDeleted: false,
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      });
    } catch {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.TENANTS_CREATED_RANGE_FAILED,
      );
    }
  }

  async getRecentTenants(limit: number): Promise<any[]> {
    try {
      const tenants = await this.prisma.tenant.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          name: true,
          subdomain: true,
          createdAt: true,
          isBlocked: true,
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
          subscriptions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              status: true,
              plan: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      });

      return tenants.map((t) => {
        const activeSub = t.subscriptions[0];
        let planStatus = 'free';
        if (activeSub) {
          if (activeSub.status === 'ACTIVE') {
            planStatus =
              Number(activeSub.plan?.price || 0) > 0 ? 'Paid' : 'free';
          } else {
            planStatus = activeSub.status.toLowerCase();
          }
        }
        return {
          id: t.id,
          name: t.name,
          subdomain: t.subdomain,
          createdAt: t.createdAt,
          isBlocked: t.isBlocked,
          ownerName: t.owner?.name || '',
          ownerEmail: t.owner?.email || '',
          planStatus,
          planName: activeSub?.plan?.name || 'Free Plan',
        };
      });
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.RECENT_TENANTS_FAILED);
    }
  }

  async getTenantsCreatedByInterval(
    start: Date,
    end: Date,
  ): Promise<{ createdAt: Date }[]> {
    try {
      return await this.prisma.tenant.findMany({
        where: {
          isDeleted: false,
          createdAt: {
            gte: start,
            lte: end,
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    } catch {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.TENANTS_INTERVAL_FAILED,
      );
    }
  }

  async getTotalUsersCount(): Promise<number> {
    try {
      return await this.prisma.user.count({
        where: { isDeleted: false },
      });
    } catch {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.TOTAL_USERS_COUNT_FAILED,
      );
    }
  }

  async getTotalRevenue(): Promise<number> {
    try {
      const sum = await this.prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: 'SUCCESS',
        },
      });
      return Number(sum._sum.amount || 0);
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.TOTAL_REVENUE_FAILED);
    }
  }
}
