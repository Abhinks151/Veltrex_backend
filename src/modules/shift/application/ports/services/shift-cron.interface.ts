export interface IShiftCronService {
  handleDailyShiftGeneration(): Promise<void>;
}
