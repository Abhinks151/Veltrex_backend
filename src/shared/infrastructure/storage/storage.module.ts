import { Module } from '@nestjs/common';

import { FILE_STORAGE } from './storage.constants';

import { S3StorageService } from './services/s3-storage.service';

@Module({
  providers: [
    {
      provide: FILE_STORAGE,
      useClass: S3StorageService,
    },
  ],

  exports: [FILE_STORAGE],
})
export class StorageModule {}
