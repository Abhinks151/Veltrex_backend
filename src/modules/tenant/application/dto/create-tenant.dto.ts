export interface TenantCreationRequestDto {
  name: string;
  subdomain?: string;
  ownerId: string;
  plan?: string;
}
