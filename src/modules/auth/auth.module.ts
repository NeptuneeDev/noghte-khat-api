import { Module } from '@nestjs/common';
import { userRepository } from '../user/user.repository';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { MailService } from './mail.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './startegies/at.startegy';
import { RefreshTokenStrategy } from './startegies/rt.strategy';

@Module({
  imports: [JwtModule.register({ secret: process.env.SECRET_KEY })],
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
