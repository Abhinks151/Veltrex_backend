export interface IBaseRepository<
  TEntity,
  TCreateDto,
  TUpdateDto = Partial<TCreateDto>,
> {
  create(data: TCreateDto): Promise<TEntity>;
  // findById(id: string): Promise<TEntity | null>;
  update(id: string, data: TUpdateDto): Promise<TEntity>;
  // delete(id: string): Promise<void>;
  // findAll(): Promise<TEntity[]>;
}
