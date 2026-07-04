import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IShiftTemplateRepository } from '../../application/ports/repositories/shift-template-repository.interface';
// import { ShiftGeneratorService } from './shift-generator.service';
import { ITransactionManager } from '@/shared/application/ports/transaction-manager.interface';
import { ShiftRepeatType } from '../../domain/shift.entity';
import { IShiftCronService } from '../../application/ports/services/shift-cron.interface';
import { IShiftGeneratorService } from '../../application/ports/services/shift-generate.service.interface';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

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
              MESSAGE_CONSTANTS.ERROR.FAILED_TO_GENERATE_PRODUCTION_SHIFT,
            );
          }
          continue;
        }
      }

      console.log(
        MESSAGE_CONSTANTS.INFO
          .DAILY_PRODUCTION_SHIFT_GENERATION_CRON_JOB_COMPLETED,
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(MESSAGE_CONSTANTS.ERROR.CRON_JOB_FAILED);
        throw new Error(MESSAGE_CONSTANTS.ERROR.CRON_JOB_FAILED);
      }
    }
  }
}
