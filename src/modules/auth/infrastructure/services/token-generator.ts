import { Injectable } from '@nestjs/common';
import { ITokenGenerator } from '../../application/ports/services/token-generator.interface';
import * as crypto from 'crypto';

@Injectable()
export class TokenGenerator implements ITokenGenerator {
  generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  hash(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
