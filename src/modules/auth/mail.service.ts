import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}
  async send(otp: number, email: string) {
    const response = await this.mailService.sendMail({
      to: email,
      from: 'info@mail.noghteh-khat.ir',
      text: '',
      subject: 'کد احراز هویت شما',
      template: './otp',
      context: {
        otp,
      },
    });
    return response;
  }
}
