import { Inject, Injectable } from '@nestjs/common';
import { IPartRepository } from '../ports/repositories/part-repository.interface';
import { ICreatePartUseCase } from '../ports/use-cases/create-part.use-case.interface';
import { CreatePartDto } from '../dto/create-part.dto';
import { Part } from '../../domain/part.entity';
import { IFileStorageService } from '@/shared/infrastructure/storage/interfaces/file-storage.interface';
import { FILE_STORAGE } from '@/shared/infrastructure/storage/storage.constants';
import { S3BucketFolderConstants } from '@/shared/enums/s3-bucket-folder.constants';

@Injectable()
export class CreatePartUseCase implements ICreatePartUseCase {
  constructor(
    @Inject('IPartRepository')
    private readonly _partRepository: IPartRepository,
    @Inject(FILE_STORAGE)
    private readonly _fileStorageService: IFileStorageService,
  ) {}

  async execute(data: CreatePartDto): Promise<Part> {
    if (data.setupSheetFile) {
      const result = await this._fileStorageService.upload(
        data.setupSheetFile,
        S3BucketFolderConstants.UPLOADS,
      );
      data.setupSheet = result.url;
      data.setupSheetKey = result.key;
    }

    if (data.engineeringDrawingFile) {
      const result = await this._fileStorageService.upload(
        data.engineeringDrawingFile,
        S3BucketFolderConstants.UPLOADS,
      );
      data.engineeringDrawing = result.url;
      data.engineeringDrawingKey = result.key;
    }

    return await this._partRepository.create(data);
  }
}
