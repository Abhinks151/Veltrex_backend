import { RegisterUserOutputDto } from '../../../presentation/dto/user.response.dto';
import { RegisterUserInput } from '../../dto/register-user-input.dto';

export interface IUserRegisterUseCase {
  execute(
    data: RegisterUserInput,
    requestId: string,
  ): Promise<RegisterUserOutputDto>;
}
