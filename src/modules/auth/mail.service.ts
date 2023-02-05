import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}
  async send(otp: number, email: string) {
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
}
