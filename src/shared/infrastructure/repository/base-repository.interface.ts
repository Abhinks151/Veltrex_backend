export interface IBaseRepository<
  TEntity,
  TCreateDto,
  TUpdateDto = Partial<TCreateDto>,
> {
  create(data: TCreateDto): Promise<TEntity>;
  update(id: string, data: TUpdateDto): Promise<TEntity>;
}
