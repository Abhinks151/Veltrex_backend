import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Auth } from '@/modules/auth/presentation/decorators/auth.decorator';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';
import { RolesGuard } from '@/modules/auth/presentation/guards/roles.guard';
import { Role } from '@/shared/enums/roles.enum';
import { ApiResponse } from '@/shared/common/apiResponse/api-response';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { CreateFixtureRequest } from './dto/create-fixture.request.dto';
import { EditFixtureRequest } from './dto/edit-fixture.request.dto';
import { ICreateFixtureUseCase } from '../application/ports/use-cases/create-fixture.use-case.interface';
import { IEditFixtureUseCase } from '../application/ports/use-cases/edit-fixture.use-case.interface';
import { IGetAllActiveFixturesUseCase } from '../application/ports/use-cases/get-all-active-fixtures.use-case.interface';
import { IBlockFixtureUseCase } from '../application/ports/use-cases/block-fixture.use-case.interface';
import { IDeleteFixtureUseCase } from '../application/ports/use-cases/delete-fixture.use-case.interface';

@Controller('fixture')
export class FixtureController {
  constructor(
    @Inject('ICreateFixtureUseCase')
    private readonly _createFixtureUseCase: ICreateFixtureUseCase,
    @Inject('IEditFixtureUseCase')
    private readonly _editFixtureUseCase: IEditFixtureUseCase,
    @Inject('IGetAllActiveFixturesUseCase')
    private readonly _getAllActiveFixturesUseCase: IGetAllActiveFixturesUseCase,
    @Inject('IBlockFixtureUseCase')
    private readonly _blockFixtureUseCase: IBlockFixtureUseCase,
    @Inject('IDeleteFixtureUseCase')
    private readonly _deleteFixtureUseCase: IDeleteFixtureUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Post('create')
  async create(@Req() req: Request, @Body() dto: CreateFixtureRequest) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._createFixtureUseCase.execute({
      ...dto,
      tenantId: req.user.tenantId,
    });

    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.FIXTURE_CREATED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Patch('edit/:id')
  async edit(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: EditFixtureRequest,
  ) {
    const result = await this._editFixtureUseCase.execute(id, dto);
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.FIXTURE_UPDATED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Get('active')
  async getActive(@Req() req: Request) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._getAllActiveFixturesUseCase.execute(
      req.user.tenantId,
    );
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.FIXTURES_FETCHED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Patch('block/:id')
  async toggleBlock(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this._blockFixtureUseCase.execute(id);
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.FIXTURE_BLOCK_TOGGLED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Delete('delete/:id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this._deleteFixtureUseCase.execute(id);
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.FIXTURE_DELETED,
    );
  }
}
