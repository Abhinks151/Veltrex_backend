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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ICreatePartUseCase } from '../application/ports/use-cases/create-part.use-case.interface';
import { IEditPartUseCase } from '../application/ports/use-cases/edit-part.use-case.interface';
import { IListPartsUseCase } from '../application/ports/use-cases/list-parts.use-case.interface';
import { IBlockPartUseCase } from '../application/ports/use-cases/block-part.use-case.interface';
import { IDeletePartUseCase } from '../application/ports/use-cases/delete-part.use-case.interface';
import { IGetAllActivePartsUseCase } from '../application/ports/use-cases/get-all-active-parts.use-case.interface';
import { IGetPartByIdUseCase } from '../application/ports/use-cases/get-part-by-id.use-case.interface';
import { Auth } from '@/modules/auth/presentation/decorators/auth.decorator';
import { CreatePartDto } from '../application/dto/create-part.dto';
import { EditPartDto } from '../application/dto/edit-part.dto';
import { Prisma } from '@prisma/client';
import { RolesGuard } from '@/modules/auth/presentation/guards/roles.guard';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';
import { Role } from '@/shared/enums/roles.enum';
import { CreatePartRequestDto } from './dto/create-part.request.dto';
import { EditPartRequestDto } from './dto/edit-part.request.dto';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { ApiResponse } from '@/shared/common/apiResponse/api-response';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { pdfFileFilter } from '@/shared/utils/file.utils';

@Controller('part')
@UseGuards(RolesGuard)
@Auth()
export class PartController {
  constructor(
    @Inject('ICreatePartUseCase')
    private readonly _createPartUseCase: ICreatePartUseCase,
    @Inject('IEditPartUseCase')
    private readonly _editPartUseCase: IEditPartUseCase,
    @Inject('IListPartsUseCase')
    private readonly _listPartsUseCase: IListPartsUseCase,
    @Inject('IBlockPartUseCase')
    private readonly _blockPartUseCase: IBlockPartUseCase,
    @Inject('IDeletePartUseCase')
    private readonly _deletePartUseCase: IDeletePartUseCase,
    @Inject('IGetAllActivePartsUseCase')
    private readonly _getAllActivePartsUseCase: IGetAllActivePartsUseCase,
    @Inject('IGetPartByIdUseCase')
    private readonly _getPartByIdUseCase: IGetPartByIdUseCase,
  ) {}

  @Post('create')
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'setupSheet', maxCount: 1 },
        { name: 'engineeringDrawing', maxCount: 1 },
      ],
      {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: pdfFileFilter,
      },
    ),
  )
  async create(
    @Req() req: Request,
    @Body() dto: CreatePartRequestDto,
    @UploadedFiles()
    files: {
      setupSheet?: Express.Multer.File[];
      engineeringDrawing?: Express.Multer.File[];
    },
  ) {
    const createData: CreatePartDto = {
      ...dto,
      tenantId: req.user!.tenantId!,
      dimensions:
        typeof dto.dimensions === 'string'
          ? (JSON.parse(dto.dimensions) as Prisma.InputJsonValue)
          : dto.dimensions,
      setupSheetFile: files.setupSheet?.[0],
      engineeringDrawingFile: files.engineeringDrawing?.[0],
    };

    const part = await this._createPartUseCase.execute(createData);
    return new ApiResponse(true, part, MESSAGE_CONSTANTS.SUCCESS.PART_CREATED);
  }

  @Get('list')
  @Roles(Role.ADMIN)
  async list(
    @Req() req: Request,
    @Query() query: PaginationQueryDto & { priority?: string },
  ) {
    const data = await this._listPartsUseCase.execute(
      req.user!.tenantId!,
      query,
    );
    return new ApiResponse(true, data, MESSAGE_CONSTANTS.SUCCESS.PARTS_FETCHED);
  }

  @Get('active')
  @Roles(Role.ADMIN, Role.MACHINIST)
  async getActive(@Req() req: Request) {
    const parts = await this._getAllActivePartsUseCase.execute(
      req.user!.tenantId!,
    );
    return new ApiResponse(
      true,
      parts,
      MESSAGE_CONSTANTS.SUCCESS.PARTS_FETCHED,
    );
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MACHINIST)
  async getById(@Param('id') id: string) {
    const part = await this._getPartByIdUseCase.execute(id);
    return new ApiResponse(true, part, MESSAGE_CONSTANTS.SUCCESS.PARTS_FETCHED);
  }

  @Patch('edit/:id')
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'setupSheet', maxCount: 1 },
        { name: 'engineeringDrawing', maxCount: 1 },
      ],
      {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: pdfFileFilter,
      },
    ),
  )
  async edit(
    @Param('id') id: string,
    @Body() dto: EditPartRequestDto,
    @UploadedFiles()
    files: {
      setupSheet?: Express.Multer.File[];
      engineeringDrawing?: Express.Multer.File[];
    },
  ) {
    const editData: EditPartDto = {
      ...dto,
      dimensions:
        typeof dto.dimensions === 'string'
          ? (JSON.parse(dto.dimensions) as Prisma.InputJsonValue)
          : dto.dimensions,
      setupSheetFile: files.setupSheet?.[0],
      engineeringDrawingFile: files.engineeringDrawing?.[0],
    };

    const part = await this._editPartUseCase.execute(id, editData);
    return new ApiResponse(true, part, MESSAGE_CONSTANTS.SUCCESS.PART_UPDATED);
  }

  @Patch('block/:id')
  @Roles(Role.ADMIN)
  async toggleBlock(@Param('id') id: string) {
    const part = await this._blockPartUseCase.execute(id);
    return new ApiResponse(
      true,
      part,
      MESSAGE_CONSTANTS.SUCCESS.PART_BLOCK_TOGGLED,
    );
  }

  @Delete('delete/:id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    const part = await this._deletePartUseCase.execute(id);
    return new ApiResponse(true, part, MESSAGE_CONSTANTS.SUCCESS.PART_DELETED);
  }
}
