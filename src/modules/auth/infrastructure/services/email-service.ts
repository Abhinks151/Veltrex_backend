import { IEmailService } from '../../application/ports/services/email-service.interface';
import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
          
          <div style="background-color: #0b3d91; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Veltrex</h1>
          </div>

          <div style="padding: 30px; color: #333;">
            <h2 style="color: #0b3d91;">Reset Your Password</h2>
            <p>You requested to reset your password. Click the button below to proceed:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${link}" 
                 style="background-color: #0b3d91; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>

            <p>If you didn’t request this, you can safely ignore this email.</p>
          </div>

          <div style="background-color: #f0f2f5; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            © ${new Date().getFullYear()} Veltrex. All rights reserved.
          </div>

        </div>
      </div>
    `,
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const link = `${this._configService.get<string>('FRONTEND_URL')}/auth/verify?token=${token}`;

    await this._tranporter.sendMail({
      from: 'Veltrex',
      to: email,
      subject: 'Email Verification',
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
          
          <div style="background-color: #0b3d91; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Veltrex</h1>
          </div>

          <div style="padding: 30px; color: #333;">
            <h2 style="color: #0b3d91;">Verify Your Email</h2>
            <p>Welcome! Please confirm your email address by clicking the button below:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${link}" 
                 style="background-color: #0b3d91; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email
              </a>
            </div>

            <p>If you did not create an account, you can ignore this email.</p>
          </div>

          <div style="background-color: #f0f2f5; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            © ${new Date().getFullYear()} Veltrex. All rights reserved.
          </div>

        </div>
      </div>
    `,
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
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
          
          <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Veltrex</h1>
          </div>

          <div style="padding: 30px; color: #333;">
            <h2 style="color: #4f46e5;">Welcome to the Team!</h2>
            <p>Your account has been successfully created. Use the credentials below to log in to the Veltrex platform:</p>

            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Initial Password:</strong> ${password}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" 
                 style="background-color: #4f46e5; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
                Log In to Veltrex
              </a>
            </div>

            <p style="color: #64748b; font-size: 14px;">
              <strong>Security Tip:</strong> After logging in, we recommend changing your password using the "Forgot Password" link on the login page for better security.
            </p>

            <p>If you have any questions, please contact your administrator.</p>
          </div>

          <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
            © ${new Date().getFullYear()} Veltrex. All rights reserved.
          </div>

        </div>
      </div>
    `,
    });
  }

  async sendEmployeeWelcomeEmail(email: string, token: string): Promise<void> {
    const setPasswordUrl = `${this._configService.get<string>('FRONTEND_URL')}/platform/reset-password?token=${token}`;

    await this._tranporter.sendMail({
      from: 'Veltrex',
      to: email,
      subject: 'Welcome to Veltrex - Set Your Password',
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
          
          <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Veltrex</h1>
          </div>

          <div style="padding: 30px; color: #333;">
            <h2 style="color: #4f46e5;">Welcome to the Team!</h2>
            <p>Your account has been successfully created. To get started, please set your password by clicking the button below:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${setPasswordUrl}" 
                 style="background-color: #4f46e5; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
                Set Your Password
              </a>
            </div>

            <p style="color: #64748b; font-size: 14px;">
              This link will expire in 1 hour. If you have any questions, please contact your administrator.
            </p>

            <p>We're excited to have you on board!</p>
          </div>

          <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
            © ${new Date().getFullYear()} Veltrex. All rights reserved.
          </div>

        </div>
      </div>
    `,
    });
  }
}
