import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { resolvePrismaClient } from '../prisma/resolve-prisma-client';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { IBaseRepository } from './base-repository.interface';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

interface CrudModel<TRaw> {
  create(args: object): Promise<TRaw>;
  update(args: object): Promise<TRaw>;
  findUnique(args: object): Promise<TRaw | null>;
  findFirst(args: object): Promise<TRaw | null>;
  findMany(args: object): Promise<TRaw[]>;
  count(args: object): Promise<number>;
  delete?(args: object): Promise<TRaw>;
}

@Injectable()
export abstract class BaseRepository<
  TEntity,
  TCreateData,
  TUpdateData,
  TRaw,
> implements IBaseRepository<TEntity, TCreateData, TUpdateData> {
  constructor(
    protected readonly _prisma: PrismaService,
    protected readonly _modelName: string,
    protected readonly _mapper: (data: TRaw) => TEntity,
    protected readonly _softDelete: boolean = true,
  ) {}

  protected getModel(client: object): CrudModel<TRaw> {
    return (client as Record<string, object>)[
      this._modelName
    ] as CrudModel<TRaw>;
  }

  async create(
    data: TCreateData,
    ctx?: ITransactionContext,
    include?: Record<string, unknown>,
  ): Promise<TEntity> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const model = this.getModel(client);
    const response = await model.create({
      data,
      include,
    });
    return this._mapper(response);
  }

  async update(
    id: string,
    data: TUpdateData,
    ctx?: ITransactionContext,
    include?: Record<string, unknown>,
  ): Promise<TEntity> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const model = this.getModel(client);
    const response = await model.update({
      where: { id },
      data,
      include,
    });
    return this._mapper(response);
  }

  async findById(
    id: string,
    ctx?: ITransactionContext,
    include?: Record<string, unknown>,
  ): Promise<TEntity | null> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const model = this.getModel(client);

    const where: Record<string, unknown> = { id };
    if (this._softDelete) {
      where.isDeleted = false;
    }

    const response = await model.findUnique({
      where,
      include,
    });
    return response ? this._mapper(response) : null;
  }

  async delete(id: string, ctx?: ITransactionContext): Promise<TEntity> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const model = this.getModel(client);

    if (this._softDelete) {
      const response = await model.update({
        where: { id },
        data: { isDeleted: true },
      });
      return this._mapper(response);
    }

    if (!model.delete) {
      throw new Error(MESSAGE_CONSTANTS.ERROR.DELETE_NOT_IMPLEMENTED);
    }

    const response = await model.delete({
      where: { id },
    });
    return this._mapper(response);
  }

  async findAll(
    query: PaginationQueryDto,
    ctx?: ITransactionContext,
    where: Record<string, unknown> = {},
    include?: Record<string, unknown>,
  ): Promise<{ items: TEntity[]; total: number }> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const model = this.getModel(client);
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const finalWhere = { ...where };
    if (this._softDelete) {
      finalWhere.isDeleted = false;
    }

    const [items, total] = await Promise.all([
      model.findMany({
        where: finalWhere,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include,
      }),
      model.count({ where: finalWhere }),
    ]);

    return {
      items: items.map((item) => this._mapper(item)),
      total,
    };
  }
}
