import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailConfigSerivce } from './mail-config.service';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailConfigSerivce,
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MaileModule {}
