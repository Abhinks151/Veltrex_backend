import { Inject, Injectable } from '@nestjs/common';
import { IJobRepository } from '../ports/repositories/job-repository.interface';
import { ICheckPartInUseUseCase } from '../ports/use-cases/check-part-in-use.use-case.interface';

@Injectable()
export class CheckPartInUseUseCase implements ICheckPartInUseUseCase {
  constructor(
    @Inject('IJobRepository')
    private readonly _jobRepository: IJobRepository,
  ) {}

  async execute(partId: string): Promise<boolean> {
    const count = await this._jobRepository.countActiveByPartId(partId);
    return count > 0;
  }
}
