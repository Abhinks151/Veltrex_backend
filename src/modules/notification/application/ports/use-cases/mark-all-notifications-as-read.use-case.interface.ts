export interface IMarkAllNotificationsAsReadUseCase {
  execute(userId: string): Promise<void>;
}
