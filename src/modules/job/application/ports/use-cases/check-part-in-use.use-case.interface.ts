export interface ICheckPartInUseUseCase {
  execute(partId: string): Promise<boolean>;
}
