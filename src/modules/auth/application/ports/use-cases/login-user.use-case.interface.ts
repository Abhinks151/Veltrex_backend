import { LoginUserResponseDto } from '../../dto/login-response.dto';

export interface IUserLoginUseCase {
  execute(userId: string, requestId: string): Promise<LoginUserResponseDto>;
}
