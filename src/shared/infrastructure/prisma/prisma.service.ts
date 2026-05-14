import { AppLogger } from '@/shared/common/logger/logger.service';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: AppLogger) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    super({ adapter });
  }

  async onModuleInit() {
    this.logger.info('Connecting to database...');
    await this.$connect();
    this.logger.info('Connected to database');
  }

  async onModuleDestroy() {
    this.logger.info('Disconnecting from database...');
    await this.$disconnect();
    this.logger.info('Disconnected from database');
  }
}
