import { ShiftJob } from '../../../domain/shift.entity';

export interface UpdateShiftJobProgressDto {
  completedQuantity: number;
}

export interface IUpdateShiftJobProgressUseCase {
  execute(
    id: string,
    tenantId: string,
    dto: UpdateShiftJobProgressDto,
  ): Promise<ShiftJob>;
}
