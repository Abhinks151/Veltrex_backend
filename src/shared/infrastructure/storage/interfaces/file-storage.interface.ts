export interface UploadFileResult {
  key: string;
  url: string;
}

export interface IFileStorageService {
  upload(file: Express.Multer.File, folder?: string): Promise<UploadFileResult>;

  delete(key: string): Promise<void>;

  getFileContent(fileUrl: string): Promise<string>;
}
