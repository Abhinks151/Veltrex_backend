import { User } from '@/modules/auth/domain/entities/user.entity';
import { CreateEmployeeInput } from '../../dto/create-employee.input.dto';

export interface BulkCreateEmployeeInput {
  employees: CreateEmployeeInput[];
}

export interface IBulkCreateEmployeeUseCase {
  execute(input: BulkCreateEmployeeInput): Promise<User[]>;
}
