import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'giorgi.pirtskhalaishvili.18@gmail.com',
        pass: 'Fircxa@18',
      },
    });
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const resetUrl = `http://localhost:3003/api/forgot-password/${token}`;
    const mailOptions = {
      from: 'giorgi.pirtskhalaishvili.18@gmail.com',
      subject: 'Password Reset',
      text: `link === >>> ${resetUrl}`,
      html: `<p> link === >>> <a href="${resetUrl}">${resetUrl}</a></p>`,
    };

  }
}