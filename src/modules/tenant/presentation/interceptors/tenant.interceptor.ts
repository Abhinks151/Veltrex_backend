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

    const hostname = host.split(':')[0];

    const apiDomain = `api.${baseDomain}`;

    // Ignore root domain and API domain.
    const isTenantSubdomain =
      hostname !== baseDomain &&
      hostname !== apiDomain &&
      hostname.endsWith(`.${baseDomain}`);

    let subdomainToResolve: string | null = null;

    if (isTenantSubdomain) {
      // Local dev: tenant derived from subdomain in the Host header (e.g. trial.lvh.me)
      subdomainToResolve = hostname.slice(0, -`.${baseDomain}`.length);
    } else if (hostname === apiDomain) {
      // Production: all requests hit api.abhinks.site, so the frontend sends
      // the tenant subdomain via the x-tenant header instead.
      const xTenant = request.headers['x-tenant'];
      if (xTenant && typeof xTenant === 'string') {
        subdomainToResolve = xTenant;
      }
    }

    if (subdomainToResolve) {
      const tenant =
        await this._getTenantBySubdomainUseCase.execute(subdomainToResolve);

      if (!tenant) {
        throw new NotFoundException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
      }

      request.tenantId = tenant.id;
      request.tenant = tenant;
    }

    return next.handle();
  }
}
