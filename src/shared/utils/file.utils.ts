import { BadRequestException } from '@nestjs/common';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

export const pdfFileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/\/pdf$/)) {
    return callback(
      new BadRequestException(MESSAGE_CONSTANTS.ERROR.ONLY_PDF_FILES_ALLOWED),
      false,
    );
  }
  callback(null, true);
};
