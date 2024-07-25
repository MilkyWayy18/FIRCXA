import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordEmail(email: string, token: string) {
    const resetUrl = `http://localhost:3020/resetToken/reset-password/${token}`;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset',
        text: `link === >>> ${resetUrl}`,
        html: `<p> link === >>> <a href="${resetUrl}">${resetUrl}</a></p>`,
      });
      console.log('email sent successfully');
    } catch (error) {
      console.error('error sending email: ', error);
    }
  }
}
