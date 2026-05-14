import { PlanType } from '@/shared/enums/plan-type.enum';

export interface TenantCreationRequestDto {
  name: string;
  ownerId: string;
  plan?: PlanType;
}
