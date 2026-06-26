import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { IGetTenantBySubdomainUseCase } from '../../application/ports/use-cases/get-tenant-by-subdomain.use-case.interface';
import { IRequest } from '@/shared/types/express-request.interface';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(
    @Inject('ITenantGetBySubdomainUseCase')
    private readonly _getTenantBySubdomainUseCase: IGetTenantBySubdomainUseCase,
    private readonly _configService: ConfigService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<IRequest>();

    const host = request.headers.host || '';
    const baseDomain =
      this._configService.get<string>('BASE_DOMAIN') || 'localhost';

    // find the host(http://localhost:3000 -> localhost)
    const hostname = host.split(':')[0];

    // check if it's a subdomain
    if (hostname !== baseDomain && hostname.endsWith(`.${baseDomain}`)) {
      const subdomain = hostname.split(`.${baseDomain}`)[0];

      const tenant = await this._getTenantBySubdomainUseCase.execute(subdomain);

      if (!tenant) {
        throw new NotFoundException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
      }

      // update the request with tenant
      request.tenantId = tenant.id;
      request.tenant = tenant;
    }

    return next.handle();
  }
}
