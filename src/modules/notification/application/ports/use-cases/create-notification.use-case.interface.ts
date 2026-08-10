import { CreateNotificationDto } from '../../../application/dto/create-notification.dto';

export interface ICreateNotificationUseCase {
  execute(dto: CreateNotificationDto): Promise<void>;
}
