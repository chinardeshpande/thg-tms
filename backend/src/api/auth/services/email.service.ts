import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;
  private readonly appUrl: string;

  constructor(private configService: ConfigService) {
    this.fromEmail = this.configService.get('EMAIL_FROM', 'noreply@thg-tms.com');
    this.appUrl = this.configService.get('APP_URL', 'http://localhost:5173');
  }

  /**
   * Send email verification email
   * TODO: Integrate with real email provider (SendGrid, AWS SES, etc.)
   */
  async sendVerificationEmail(
    email: string,
    token: string,
    firstName: string,
  ): Promise<void> {
    const verificationUrl = `${this.appUrl}/verify-email?token=${token}`;

    // For development: Log the verification URL
    this.logger.log(`
      ========================================
      EMAIL VERIFICATION
      ========================================
      To: ${email}
      Subject: Verify your THG TMS account

      Hi ${firstName},

      Please verify your email address by clicking the link below:
      ${verificationUrl}

      This link will expire in 24 hours.

      If you didn't create an account, please ignore this email.

      Best regards,
      THG TMS Team
      ========================================
    `);

    // TODO: Replace with actual email sending
    // Example with SendGrid:
    // await this.sendGridClient.send({
    //   to: email,
    //   from: this.fromEmail,
    //   subject: 'Verify your THG TMS account',
    //   html: this.getVerificationEmailTemplate(firstName, verificationUrl),
    // });
  }

  /**
   * Send password reset email
   * TODO: Integrate with real email provider
   */
  async sendPasswordResetEmail(
    email: string,
    token: string,
    firstName: string,
  ): Promise<void> {
    const resetUrl = `${this.appUrl}/reset-password?token=${token}`;

    // For development: Log the reset URL
    this.logger.log(`
      ========================================
      PASSWORD RESET
      ========================================
      To: ${email}
      Subject: Reset your THG TMS password

      Hi ${firstName},

      You requested to reset your password. Click the link below to create a new password:
      ${resetUrl}

      This link will expire in 1 hour.

      If you didn't request a password reset, please ignore this email and ensure your account is secure.

      Best regards,
      THG TMS Team
      ========================================
    `);

    // TODO: Replace with actual email sending
  }

  /**
   * Send welcome email after successful verification
   */
  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    this.logger.log(`
      ========================================
      WELCOME EMAIL
      ========================================
      To: ${email}
      Subject: Welcome to THG TMS!

      Hi ${firstName},

      Your email has been verified! Welcome to THG Transport Management System.

      You can now access all features of your account.

      Get started: ${this.appUrl}/dashboard

      Best regards,
      THG TMS Team
      ========================================
    `);

    // TODO: Replace with actual email sending
  }

  /**
   * Send account activation email (when admin activates a user)
   */
  async sendAccountActivationEmail(email: string, firstName: string): Promise<void> {
    this.logger.log(`
      ========================================
      ACCOUNT ACTIVATION
      ========================================
      To: ${email}
      Subject: Your THG TMS account has been activated

      Hi ${firstName},

      Great news! Your account has been activated by an administrator.

      You can now log in and start using THG TMS.

      Login here: ${this.appUrl}/login

      Best regards,
      THG TMS Team
      ========================================
    `);

    // TODO: Replace with actual email sending
  }

  /**
   * HTML template for verification email
   * Can be enhanced with proper email templates
   */
  private getVerificationEmailTemplate(firstName: string, verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #000;
              color: #fff;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
            }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Verify your email address</h2>
            <p>Hi ${firstName},</p>
            <p>Thank you for registering with THG Transport Management System.</p>
            <p>Please click the button below to verify your email address:</p>
            <a href="${verificationUrl}" class="button">Verify Email</a>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all;">${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, please ignore this email.</p>
            <div class="footer">
              <p>Best regards,<br>THG TMS Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * HTML template for password reset email
   */
  private getPasswordResetEmailTemplate(firstName: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #000;
              color: #fff;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 12px;
              margin: 20px 0;
            }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Reset your password</h2>
            <p>Hi ${firstName},</p>
            <p>You requested to reset your password for your THG TMS account.</p>
            <p>Click the button below to create a new password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all;">${resetUrl}</p>
            <div class="warning">
              <strong>Security Notice:</strong> This link will expire in 1 hour.
              If you didn't request a password reset, please ignore this email and ensure your account is secure.
            </div>
            <div class="footer">
              <p>Best regards,<br>THG TMS Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
