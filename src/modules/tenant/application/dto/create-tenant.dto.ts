export interface TenantCreationRequestDto {
  name: string;
  ownerId: string;
  plan?: string;
}
