import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import {
  IFileStorageService,
  UploadFileResult,
} from '../interfaces/file-storage.interface';
import { ConfigService } from '@nestjs/config';
import { S3BucketFolderConstants } from '@/shared/enums/s3-bucket-folder.constants';

@Injectable()
export class S3StorageService implements IFileStorageService {
  private readonly _s3: S3Client;
  private readonly _bucket: string;
  private readonly _region: string;
  constructor(private readonly _configService: ConfigService) {
    this._region = this._configService.get<string>('AWS_REGION')!;
    this._bucket = this._configService.get<string>('AWS_BUCKET_NAME')!;

    this._s3 = new S3Client({
      region: this._region,
      credentials: {
        accessKeyId: this._configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this._configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        )!,
      },
    });
  }

  async upload(
    file: Express.Multer.File,
    folder = S3BucketFolderConstants.UPLOADS,
  ): Promise<UploadFileResult> {
    const fileExtension = file.originalname.split('.').pop();

    const key = `${folder}/${randomUUID()}.${fileExtension}`;

    // Body: Readable.from(file.buffer),
    // s3 does not require stream
    await this._s3.send(
      new PutObjectCommand({
        Bucket: this._bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = `https://${this._bucket}.s3.${this._region}.amazonaws.com/${key}`;

    return { key, url };
  }

  async delete(key: string): Promise<void> {
    await this._s3.send(
      new DeleteObjectCommand({
        Bucket: this._bucket,
        Key: key,
      }),
    );
  }

  async getFileContent(fileUrl: string): Promise<string> {
    try {
      const urlObject = new URL(fileUrl);
      const key = decodeURIComponent(urlObject.pathname.substring(1));

      const { GetObjectCommand } = await import('@aws-sdk/client-s3');
      const response = await this._s3.send(
        new GetObjectCommand({
          Bucket: this._bucket,
          Key: key,
        }),
      );

      if (!response.Body) {
        throw new Error('S3 response body is empty');
      }

      return await response.Body.transformToString('utf-8');
    } catch {
      throw new Error('Could not retrieve file content');
    }
  }
}
