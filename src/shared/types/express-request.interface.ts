import { Request } from 'express';
import {
  IAuthenticatedUser,
  IRequestTenant,
} from './authenticated-user.interface';

export type IRequest = Omit<Request, 'user'> & {
  user: IAuthenticatedUser;
  tenantId?: string;
  tenant?: IRequestTenant;
};
