export interface IRefreshTokenUseCase {
  execute(refreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
  }>;
}
