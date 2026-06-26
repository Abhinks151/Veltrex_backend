import { Inject } from '@nestjs/common';
import { User } from '@/modules/auth/domain/entities/user.entity';
import {
  BulkCreateEmployeeInput,
  IBulkCreateEmployeeUseCase,
} from '../ports/use-cases/bulk-create-employee.use-case.interface';
import { ICreateEmployeeUseCase } from '../ports/use-cases/create-employee.use-case.interface';

export class BulkCreateEmployeeUseCase implements IBulkCreateEmployeeUseCase {
  constructor(
    @Inject('ICreateEmployeeUseCase')
    private readonly _createEmployeeUseCase: ICreateEmployeeUseCase,
  ) {}

  async execute(input: BulkCreateEmployeeInput): Promise<User[]> {
    const results: User[] = [];

    for (let i = 0; i < input.employees.length; i++) {
      const result = await this._createEmployeeUseCase.execute(
        input.employees[i],
      );
      results.push(result);
    }

    return results;
  }
}
