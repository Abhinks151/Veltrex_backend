import { Inject, Injectable } from '@nestjs/common';
import { IUploadProfileImageUseCase } from '../ports/use-cases/upload-profile-image.use-case.interface';
import { IFileStorageService } from '@/shared/infrastructure/storage/interfaces/file-storage.interface';
import { IAuthQueryService } from '@/modules/auth/application/ports/services/auth-query.service.interface';
import { FILE_STORAGE } from '@/shared/infrastructure/storage/storage.constants';
import { S3BucketFolderConstants } from '@/shared/enums/s3-bucket-folder.constants';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { NotFoundError } from '@/shared/common/errors/domain-errors';

@Injectable()
export class UploadProfileImageUseCase implements IUploadProfileImageUseCase {
  constructor(
    @Inject(FILE_STORAGE)
    private readonly _fileStorageService: IFileStorageService,
    @Inject('IAuthQueryService')
    private readonly _authQueryService: IAuthQueryService,
  ) {}

  async execute(userId: string, file: Express.Multer.File): Promise<string> {
    const user = await this._authQueryService.findById(userId);
    if (!user) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }
    const oldKey = user.profileImageKey;

    const result = await this._fileStorageService.upload(
      file,
      S3BucketFolderConstants.PROFILES,
    );

    await this._authQueryService.updateProfileImage(
      userId,
      result.url,
      result.key,
    );

    if (oldKey) {
      await this._fileStorageService.delete(oldKey);
    }

    return result.url;
  }
}
