import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import dotenv from 'dotenv';
dotenv.config();
import {
  IFileStorageService,
  UploadFileResult,
} from '../interfaces/file-storage.interface';

@Injectable()
export class CloudinaryStorageService implements IFileStorageService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async upload(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<UploadFileResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
        },
        (error, result) => {
          if (error || !result) {
            return reject(
              error instanceof Error
                ? error
                : new Error('Cloudinary upload failed'),
            );
          }

          resolve({
            key: result.public_id,
            url: result.secure_url,
          });
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async delete(key: string): Promise<void> {
    await cloudinary.uploader.destroy(key);
  }
}
