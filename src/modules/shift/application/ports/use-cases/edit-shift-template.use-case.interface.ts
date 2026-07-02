import { ShiftTemplate } from '../../../domain/shift.entity';
import { CreateShiftTemplateDto } from '../../dto/create-shift-template.dto';

export interface IEditShiftTemplateUseCase {
  execute(
    id: string,
    tenantId: string,
    dto: Partial<CreateShiftTemplateDto>,
  ): Promise<ShiftTemplate>;
}
