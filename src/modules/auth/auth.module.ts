import { Module } from '@nestjs/common';
import { userRepository } from '../user/user.repository';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './startegies/at.startegy';
import { RefreshTokenStrategy } from './startegies/rt.strategy';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthService,
    AuthRepository,
    OtpService,
    userRepository,
    RefreshTokenStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
