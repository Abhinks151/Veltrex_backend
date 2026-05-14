import { UpdateUserOutputDto } from '../../../presentation/dto/user.response.dto';
import { UpdateUserInputDto } from '../../dto/update-user-input.dto';

export interface IUpdateUserUseCase {
  execute(
    reqDto: UpdateUserInputDto,
    userId: string,
  ): Promise<UpdateUserOutputDto>;
}
