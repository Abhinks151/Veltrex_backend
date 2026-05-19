export interface ValidatedUserDto {
  userId: string;
  name: string;
  uuid: string;
  email: string;
  role: string;
  is_verified: boolean;
  profileImage?: string;
  tenantId?: string;
}
