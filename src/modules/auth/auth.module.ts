import { Module } from '@nestjs/common';
import { userRepository } from '../user/user.repository';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { MailService } from './mail.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './startegies/at.startegy';
import { RefreshTokenStrategy } from './startegies/rt.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.SECRET_KEY }),
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: +process.env.MAIL_PORT,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          },
        },
        defaults: {
          from: 'info@mail.noghteh-khat.ir',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    AuthRepository,
    MailService,
    userRepository,
    RefreshTokenStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
