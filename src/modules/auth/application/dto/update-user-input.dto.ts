export interface UpdateUserInputDto {
  name?: string;
  email?: string;
  password?: string;
  is_verified?: boolean;
  profileImage?: string;
  profileImageKey?: string;
  tenantId?: string;
}
