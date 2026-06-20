export interface CreatePlanDto {
  code: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  durationDays?: number;
}
