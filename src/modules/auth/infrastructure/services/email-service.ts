import { IEmailService } from '../../application/ports/services/email-service.interface';
import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  getPasswordResetEmailTemplate,
  getVerificationEmailTemplate,
  getEmployeeDetailsEmailTemplate,
  getEmployeeWelcomeEmailTemplate,
} from '@/shared/templates/email.template';

@Injectable()
export class EmailService implements IEmailService {
  private _tranporter;
  constructor(private readonly _configService: ConfigService) {
    this._tranporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this._configService.get<string>('EMAIL_USER'),
        pass: this._configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendPasswordResetEmail(
    email: string,
    token: string,
    resetLink?: string,
  ): Promise<void> {
    const link = resetLink
      ? `${resetLink}?token=${token}`
      : `${this._configService.get<string>('FRONTEND_URL')}/auth/reset-password?token=${token}`;

    await this._tranporter.sendMail({
      from: 'Veltrex',
      to: email,
      subject: 'Password Reset',
      html: getPasswordResetEmailTemplate(link),
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const link = `${this._configService.get<string>('FRONTEND_URL')}/auth/verify?token=${token}`;

    await this._tranporter.sendMail({
      from: 'Veltrex',
      to: email,
      subject: 'Email Verification',
      html: getVerificationEmailTemplate(link),
    });
  }

  async sendEmployeeDetailsEmail(
    email: string,
    password: string,
  ): Promise<void> {
    const loginUrl = `${this._configService.get<string>('FRONTEND_URL')}/platform/login`;

    await this._tranporter.sendMail({
      from: 'Veltrex',
      to: email,
      subject: 'Welcome to Veltrex - Your Account Details',
      html: getEmployeeDetailsEmailTemplate(email, password, loginUrl),
    });
  }

  async sendEmployeeWelcomeEmail(email: string, token: string): Promise<void> {
    const setPasswordUrl = `${this._configService.get<string>('FRONTEND_URL')}/platform/reset-password?token=${token}`;

    await this._tranporter.sendMail({
      from: 'Veltrex',
      to: email,
      subject: 'Welcome to Veltrex - Set Your Password',
      html: getEmployeeWelcomeEmailTemplate(setPasswordUrl),
    });
  }
}
