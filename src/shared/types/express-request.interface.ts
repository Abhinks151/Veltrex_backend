import { Request } from 'express';
import { ValidatedUserDto } from '@/modules/auth/application/dto/jwt-strategy.dto';
import { Tenant } from '@/modules/tenant/domain/tenant.entity';

export type IRequest = Omit<Request, 'user'> & {
  user: ValidatedUserDto;
  tenantId?: string;
  tenant?: Tenant;
};
