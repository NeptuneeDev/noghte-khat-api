import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as nodeMailer from 'nodemailer';
@Injectable()
export class ExampleService {
  constructor(private readonly mailerService: MailerService) {}
}
export class MailService {
  transporter: any;
  constructor(private mailService: MailerService) {
    this.transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'khalvayozbek@gmail.com',
        pass: '',
      },
    });
  }
  async send(otp: number, email: string) {
    const response = await this.transporter.sendMail({
      to: email,
      from: 'khalvayozbek@gmail.com',
      subject: 'احراز هویت',
      text: ` این ${otp}کد احرازهویت شما میباشد  `,
    });
    return response;
  }
}
