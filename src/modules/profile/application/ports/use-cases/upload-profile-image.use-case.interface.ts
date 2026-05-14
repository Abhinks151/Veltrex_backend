export interface IUploadProfileImageUseCase {
  execute(userId: string, file: Express.Multer.File): Promise<string>;
}
