import { ShiftTemplate } from '../../../domain/shift.entity';
import { CreateShiftTemplateDto } from '../../dto/create-shift-template.dto';

export interface ICreateShiftTemplateUseCase {
  execute(dto: CreateShiftTemplateDto): Promise<ShiftTemplate>;
}
