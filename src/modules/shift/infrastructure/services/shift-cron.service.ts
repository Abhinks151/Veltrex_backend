import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IShiftTemplateRepository } from '../../application/ports/repositories/shift-template-repository.interface';
// import { ShiftGeneratorService } from './shift-generator.service';
import { ITransactionManager } from '@/shared/application/ports/transaction-manager.interface';
import { ShiftRepeatType } from '../../domain/shift.entity';
import { IShiftCronService } from '../../application/ports/services/shift-cron.interface';
import { IShiftGeneratorService } from '../../application/ports/services/shift-generate.service.interface';

@Injectable()
export class ShiftCronService implements IShiftCronService {
  constructor(
    @Inject('IShiftTemplateRepository')
    private readonly _shiftTemplateRepository: IShiftTemplateRepository,
    @Inject('ITransactionManager')
    private readonly _txManager: ITransactionManager,
    @Inject('IShiftGeneratorService')
    private readonly _shiftGenerator: IShiftGeneratorService,
  ) {}

  // @Cron('0 0 * * 1-5', {
  //   timeZone: 'Asia/Kolkata',
  // })
  // this is the normal way
  // nestjs have some default options use that

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyShiftGeneration() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    try {
      const activeTemplates =
        await this._shiftTemplateRepository.findActiveTemplatesForDate(today);

      for (const template of activeTemplates) {
        const templateStart = new Date(template.startDate);
        templateStart.setUTCHours(0, 0, 0, 0);

        if (
          template.repeatType !== ShiftRepeatType.DAILY &&
          (template.repeatType !== ShiftRepeatType.NONE ||
            templateStart.getTime() !== today.getTime())
        ) {
          continue;
        }

        try {
          await this._txManager.run(async (ctx) => {
            await this._shiftGenerator.generateForTemplate(
              template.id,
              today,
              null,
              ctx,
            );
          });
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.log(
              `Failed to generate Production Shift for template ID: ${template.id}. Error: ${err.message}`,
            );
          }
          continue;
        }
      }

      console.log('Daily Production Shift generation cron job completed.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(`Cron job failed: ${err.message}`);
        throw new Error(`Cron job failed: ${err.message}`);
      }
    }
  }
}
