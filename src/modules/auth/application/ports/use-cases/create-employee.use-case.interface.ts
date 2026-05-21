import { User } from '@/modules/auth/domain/entities/user.entity';
import { CreateEmployeeInput } from '../../dto/create-employee.input.dto';

export interface ICreateEmployeeUseCase {
  execute(input: CreateEmployeeInput): Promise<User>;
}
