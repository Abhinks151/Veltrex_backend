import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FixtureController } from './presentation/fixture.controller';
import { FixtureRepository } from './infrastructure/repositories/fixture-repository';
import { CreateFixtureUseCase } from './application/use-cases/create-fixture.use-case';
import { EditFixtureUseCase } from './application/use-cases/edit-fixture.use-case';
import { GetAllActiveFixturesUseCase } from './application/use-cases/get-all-active-fixtures.use-case';
import { BlockFixtureUseCase } from './application/use-cases/block-fixture.use-case';
import { DeleteFixtureUseCase } from './application/use-cases/delete-fixture.use-case';

@Module({
  imports: [AuthModule],
  controllers: [FixtureController],
  providers: [
    {
      provide: 'IFixtureRepository',
      useClass: FixtureRepository,
    },
    {
      provide: 'ICreateFixtureUseCase',
      useClass: CreateFixtureUseCase,
    },
    {
      provide: 'IEditFixtureUseCase',
      useClass: EditFixtureUseCase,
    },
    {
      provide: 'IGetAllActiveFixturesUseCase',
      useClass: GetAllActiveFixturesUseCase,
    },
    {
      provide: 'IBlockFixtureUseCase',
      useClass: BlockFixtureUseCase,
    },
    {
      provide: 'IDeleteFixtureUseCase',
      useClass: DeleteFixtureUseCase,
    },
  ],
})
export class FixtureModule {}
