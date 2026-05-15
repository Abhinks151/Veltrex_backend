import { Injectable } from '@nestjs/common';
import { IPasswordService } from '../../application/ports/services/password-service.interface';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordService implements IPasswordService {
  constructor(private readonly _configService: ConfigService) {}

  async hash(raw: string): Promise<string> {
    return bcrypt.hash(
      raw,
      Number(this._configService.get<string>('SALT')) || 10,
    );
  }

  async compare(raw: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(raw, hashed);
  }
}
