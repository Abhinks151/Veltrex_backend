import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

import { Auth } from '@/modules/auth/presentation/decorators/auth.decorator';
import { RolesGuard } from '@/modules/auth/presentation/guards/roles.guard';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';
import { Role } from '@/shared/enums/roles.enum';
import { ApiResponse } from '@/shared/common/apiResponse/api-response';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { IFileStorageService } from '@/shared/infrastructure/storage/interfaces/file-storage.interface';
import { FILE_STORAGE } from '@/shared/infrastructure/storage/storage.constants';
import { S3BucketFolderConstants } from '@/shared/enums/s3-bucket-folder.constants';

import { CreateNcProgramUseCase } from '../application/use-cases/create-nc-program.use-case';
import { UpdateNcProgramUseCase } from '../application/use-cases/update-nc-program.use-case';
import { GetNcProgramListUseCase } from '../application/use-cases/get-nc-program-list.use-case';
import { DeleteProgramVersionUseCase } from '../application/use-cases/delete-program-version.use-case';
import { IProgramVersionRepository } from '../application/ports/repositories/program-version-repository.interface';
import { INcProgramRepository } from '../application/ports/repositories/nc-program-repository.interface';

import { EditNcProgramRequestDto } from './dto/edit-nc-program.request.dto';
import { MAX_NC_FILE_SIZE, NC_FILE_EXTENSIONS } from '@/shared/enums/constants';

@Controller('nc-program')
@UseGuards(RolesGuard)
@Auth()
export class NcProgramController {
  constructor(
    private readonly createNcProgramUseCase: CreateNcProgramUseCase,
    private readonly updateNcProgramUseCase: UpdateNcProgramUseCase,
    private readonly getNcProgramListUseCase: GetNcProgramListUseCase,
    private readonly deleteProgramVersionUseCase: DeleteProgramVersionUseCase,

    @Inject('INcProgramRepository')
    private readonly ncProgramRepository: INcProgramRepository,

    @Inject('IProgramVersionRepository')
    private readonly programVersionRepository: IProgramVersionRepository,

    @Inject(FILE_STORAGE)
    private readonly fileStorageService: IFileStorageService,
  ) {}

  @Post('create')
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('ncFile', {
      limits: { fileSize: MAX_NC_FILE_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!NC_FILE_EXTENSIONS.test(file.originalname)) {
          return cb(
            new Error(MESSAGE_CONSTANTS.ERROR.INVALID_NC_FILE_TYPE),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Req() req: Request,
    @Body('name') name: string,
    @Body('description') description: string | undefined,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploaded = await this.fileStorageService.upload(
      file,
      S3BucketFolderConstants.UPLOADS,
    );

    const program = await this.createNcProgramUseCase.execute({
      tenantId: req.user!.tenantId!,
      createdBy: req.user!.userId,
      name,
      initialVersion: {
        fileUrl: uploaded.url,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        description,
      },
    });

    return new ApiResponse(
      true,
      program,
      MESSAGE_CONSTANTS.SUCCESS.NC_PROGRAM_CREATED,
    );
  }

  @Get('list')
  @Roles(Role.ADMIN)
  async list(@Req() req: Request, @Query() query: PaginationQueryDto) {
    const { items, total } = await this.getNcProgramListUseCase.execute(
      req.user!.tenantId!,
      query,
    );
    return new ApiResponse(
      true,
      { programs: items, total },
      MESSAGE_CONSTANTS.SUCCESS.NC_PROGRAMS_FETCHED,
    );
  }

  @Get('active')
  @Roles(Role.ADMIN, Role.MACHINIST)
  async getActive(@Req() req: Request) {
    const programs = await this.ncProgramRepository.findAllActive(
      req.user!.tenantId!,
    );
    return new ApiResponse(
      true,
      programs,
      MESSAGE_CONSTANTS.SUCCESS.NC_PROGRAMS_FETCHED,
    );
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async getById(@Req() req: Request, @Param('id') id: string) {
    const program = await this.ncProgramRepository.findById(id);
    if (!program || program.tenantId !== req.user!.tenantId!) {
      throw new Error(MESSAGE_CONSTANTS.ERROR.NC_PROGRAM_NOT_FOUND);
    }
    return new ApiResponse(
      true,
      program,
      MESSAGE_CONSTANTS.SUCCESS.NC_PROGRAMS_FETCHED,
    );
  }

  @Patch('edit/:id')
  @Roles(Role.ADMIN)
  async edit(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: EditNcProgramRequestDto,
  ) {
    const program = await this.updateNcProgramUseCase.execute({
      id,
      tenantId: req.user!.tenantId!,
      name: dto.name,
    });
    return new ApiResponse(
      true,
      program,
      MESSAGE_CONSTANTS.SUCCESS.NC_PROGRAM_UPDATED,
    );
  }

  @Post(':id/version')
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('ncFile', {
      limits: { fileSize: MAX_NC_FILE_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!NC_FILE_EXTENSIONS.test(file.originalname)) {
          return cb(
            new Error(MESSAGE_CONSTANTS.ERROR.INVALID_NC_FILE_TYPE),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async addVersion(
    @Req() req: Request,
    @Param('id') programId: string,
    @Body('description') description: string | undefined,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploaded = await this.fileStorageService.upload(
      file,
      S3BucketFolderConstants.UPLOADS,
    );

    const version = await this.programVersionRepository.addVersion({
      programId,
      tenantId: req.user!.tenantId!,
      createdBy: req.user!.userId,
      fileUrl: uploaded.url,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      description,
    });

    return new ApiResponse(
      true,
      version,
      MESSAGE_CONSTANTS.SUCCESS.NC_VERSION_ADDED,
    );
  }

  @Get('version/:id')
  @Roles(Role.ADMIN, Role.MACHINIST)
  async getVersionById(@Param('id') id: string) {
    const version = await this.programVersionRepository.findVersionById(id);
    return new ApiResponse(
      true,
      version,
      MESSAGE_CONSTANTS.SUCCESS.NC_PROGRAMS_FETCHED,
    );
  }

  @Patch('version/:id/block')
  @Roles(Role.ADMIN)
  async toggleBlockVersion(@Param('id') id: string) {
    const version = await this.programVersionRepository.toggleBlockVersion(id);
    return new ApiResponse(
      true,
      version,
      MESSAGE_CONSTANTS.SUCCESS.NC_VERSION_BLOCK_TOGGLED,
    );
  }

  @Delete('version/:id/delete')
  @Roles(Role.ADMIN)
  async deleteVersion(@Req() req: Request, @Param('id') id: string) {
    const version = await this.programVersionRepository.findVersionById(id);
    const deleted = await this.deleteProgramVersionUseCase.execute(
      id,
      version.programId,
    );
    return new ApiResponse(
      true,
      deleted,
      MESSAGE_CONSTANTS.SUCCESS.NC_VERSION_DELETED,
    );
  }
}
