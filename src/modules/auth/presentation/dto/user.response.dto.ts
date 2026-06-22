export interface RegisterUserOutputDto {
  id: string;
  email: string;
  name: string;
  tenantId?: string;
}

export interface UpdateUserOutputDto {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  tenantId?: string;
}

export interface LoginUserOutputDto {
  user: {
    id: string;
    email: string;
    name: string;
    tenantId?: string;
  };
  access_token: string;
  refresh_token: string;
}
