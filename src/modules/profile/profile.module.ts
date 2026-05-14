import { Module } from '@nestjs/common';
import { ProfileController } from './presentation/profile.controller';
import { UploadProfileImageUseCase } from './application/use-cases/upload-profile-image.use-case';
import { UpdateProfileUseCase } from './application/use-cases/update-profile.use-case';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';
import { StorageModule } from '@/shared/infrastructure/storage/storage.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [StorageModule, AuthModule],
  controllers: [ProfileController],
  providers: [
    {
      provide: 'IUploadProfileImageUseCase',
      useClass: UploadProfileImageUseCase,
    },
    {
      provide: 'IUpdateProfileUseCase',
      useClass: UpdateProfileUseCase,
    },
    {
      provide: 'IChangePasswordUseCase',
      useClass: ChangePasswordUseCase,
    },
  ],
})
export class ProfileModule {}
