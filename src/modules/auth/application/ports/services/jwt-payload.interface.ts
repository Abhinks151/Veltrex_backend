export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  is_verified: boolean;
  name: string;
}
