import { IEmailService } from '../../application/ports/services/email-service.interface';
// import nodemailer from "nodemailer";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
dotenv.config();

@Injectable()
export class EmailService implements IEmailService {
  private _tranporter;
  constructor() {
    this._tranporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const link = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

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
    const link = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;

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
}
