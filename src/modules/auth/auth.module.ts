import { Module } from '@nestjs/common';
import { userRepository } from '../user/user.repository';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './startegy/jwt.startegy';
const secret = process.env.SECRET_KEY as string;
@Module({
  imports: [
    JwtModule.register({
      secret: secret,
      signOptions: {
        expiresIn: '60min',
      },
    }),
  ],
  providers: [
    AuthService,
    AuthRepository,
    OtpService,
    userRepository,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
