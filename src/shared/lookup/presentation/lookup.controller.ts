import { Controller, Get, Inject, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import { ILookupService } from '../application/ports/services/lookup.service.interface';
import { ApiResponse } from '@/shared/common/apiResponse/api-response';

@Controller('lookups')
export class LookupController {
  constructor(
    @Inject('ILookupService')
    private readonly lookupService: ILookupService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAll(@Req() req: Request) {
    const tenantId = req.user?.tenantId;
    const result = await this.lookupService.getAll(tenantId);
    return new ApiResponse(true, result, 'Lookups fetched successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':category')
  async getByCategory(
    @Param('category') category: string,
    @Req() req: Request,
  ) {
    const tenantId = req.user?.tenantId;
    const result = await this.lookupService.getByCategory(category, tenantId);
    return new ApiResponse(
      true,
      result,
      `Lookups for ${category} fetched successfully`,
    );
  }
}
