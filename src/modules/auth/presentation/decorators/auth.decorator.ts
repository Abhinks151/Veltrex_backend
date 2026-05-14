import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IsVerifiedGuard } from '../guards/is-verified.guard';

export function Auth() {
  return applyDecorators(UseGuards(JwtAuthGuard, IsVerifiedGuard));
}
