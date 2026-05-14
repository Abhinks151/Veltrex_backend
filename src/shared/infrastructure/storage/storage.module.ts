import { Module } from '@nestjs/common';

import { FILE_STORAGE } from './storage.constants';

import { CloudinaryStorageService } from './services/cloudinary-storage.service';

@Module({
  providers: [
    {
      provide: FILE_STORAGE,
      useClass: CloudinaryStorageService,
    },
  ],

  exports: [FILE_STORAGE],
})
export class StorageModule {}
