// export interface IPasswordService {
//   hash(raw: string): Promise<string>;
//   compare(raw: string, hashed: string): Promise<boolean>;
// }

import { Injectable } from '@nestjs/common';
import { IPasswordService } from '../../application/ports/services/password-service.interface';
import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PasswordService implements IPasswordService {
  constructor() {}

  async hash(raw: string): Promise<string> {
    return bcrypt.hash(raw, Number(process.env.SALT) || 10);
  }

  async compare(raw: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(raw, hashed);
  }
}
