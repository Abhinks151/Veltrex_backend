import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IUploadProfileImageUseCase } from '../application/ports/use-cases/upload-profile-image.use-case.interface';
import { IUpdateProfileUseCase } from '../application/ports/use-cases/update-profile.use-case.interface';
import { IChangePasswordUseCase } from '../application/ports/use-cases/change-password.use-case.interface';
import { Auth } from '@/modules/auth/presentation/decorators/auth.decorator';
import { Request } from 'express';
import { UpdateProfileRequestDto } from './dto/update-profile.request.dto';
import { ChangePasswordRequestDto } from './dto/change-password.request.dto';
import { ApiResponse } from '@/shared/common/apiResponse/api-response';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { RolesGuard } from '@/modules/auth/presentation/guards/roles.guard';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';
import { Role } from '@/shared/enums/roles.enum';

@Controller('profile')
export class ProfileController {
  constructor(
    @Inject('IUploadProfileImageUseCase')
    private readonly _uploadProfileImageUseCase: IUploadProfileImageUseCase,
    @Inject('IUpdateProfileUseCase')
    private readonly _updateProfileUseCase: IUpdateProfileUseCase,
    @Inject('IChangePasswordUseCase')
    private readonly _changePasswordUseCase: IChangePasswordUseCase,
  ) {}

  @Roles(Role.ADMIN, Role.MACHINIST, Role.MAINTENANCE)
  @UseGuards(RolesGuard)
  @Auth()
  @Get()
  getProfile(@Req() req: Request) {
    return new ApiResponse(
      true,
      req.user,
      MESSAGE_CONSTANTS.SUCCESS.USER_PROFILE,
    );
  }

  @Roles(Role.ADMIN, Role.MACHINIST, Role.MAINTENANCE)
  @UseGuards(RolesGuard)
  @Auth()
  @Patch('update')
  async updateProfile(
    @Req() req: Request,
    @Body() dto: UpdateProfileRequestDto,
  ) {
    const data = await this._updateProfileUseCase.execute(
      req.user!.userId,
      dto.name!,
    );
    return new ApiResponse(true, data, MESSAGE_CONSTANTS.SUCCESS.USER_UPDATED);
  }

  @Roles(Role.ADMIN, Role.MACHINIST, Role.MAINTENANCE)
  @UseGuards(RolesGuard)
  @Auth()
  @Patch('password')
  async changePassword(
    @Req() req: Request,
    @Body() dto: ChangePasswordRequestDto,
  ) {
    const data = await this._changePasswordUseCase.execute(
      req.user!.userId,
      dto.currentPassword,
      dto.newPassword,
    );
    return new ApiResponse(
      true,
      data,
      MESSAGE_CONSTANTS.SUCCESS.PASSWORD_RESET,
    );
  }

  @Roles(Role.ADMIN, Role.MACHINIST, Role.MAINTENANCE)
  @UseGuards(RolesGuard)
  @Auth()
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException(
              MESSAGE_CONSTANTS.ERROR.ONLY_IMAGE_FILES_ALLOWED,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(MESSAGE_CONSTANTS.ERROR.FILE_IS_REQUIRED);
    }
    const url = await this._uploadProfileImageUseCase.execute(
      req.user!.userId,
      file,
    );
    return new ApiResponse(
      true,
      { url },
      MESSAGE_CONSTANTS.SUCCESS.PROFILE_IMAGE_UPLOADED,
    );
  }
}
