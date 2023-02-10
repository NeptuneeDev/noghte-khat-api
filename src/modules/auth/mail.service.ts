import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}
  async sendOtp(otp: number, email: string) {
    const response = await this.mailService.sendMail({
      to: email,
      subject: 'کد تایید ایمیل شما',
      template: './otp',
      context: {
        otp,
      },
    });
    return response;
  }

  async send(link: string, email: string) {
    const response = await this.mailService.sendMail({
      to: email,
      subject: 'لینک فراموشی رمز عبور',
      template: './forgetPassword',
      context: {
        link,
      },
    });
  }
}
