import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}
  async sendOtp(otp: number, email: string) {
    return await this.mailService.sendMail({
      to: email,
      subject: 'کد تایید ایمیل شما',
      template: './otp',
      context: {
        otp,
      },
    });
  }

  async forgetPassword(link: string, email: string) {
    return await this.mailService.sendMail({
      to: email,
      subject: 'لینک فراموشی رمز عبور',
      template: './forgetPassword',
      context: {
        link,
      },
    });
  }
}
