export interface RegisterUserOutputDto {
  id: string;
  email: string;
  name: string;
}

export interface UpdateUserOutputDto {
  id: string;
  email: string;
  name: string;
}

export interface LoginUserOutputDto {
  user: {
    id: string;
    email: string;
    name: string;
  };
  access_token: string;
  refresh_token: string;
}
