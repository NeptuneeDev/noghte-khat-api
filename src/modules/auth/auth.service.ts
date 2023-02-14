import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hash } from 'src/common/utils/Hash';
import { userRepository } from '../user/user.repository';
import { UserLoginDto } from './Dto/user-login.Dto';
import { SignUpDto } from './Dto/user-signUp.dto';
import { AuthRepository } from './auth.repository';
import { Verificaition } from './interfaces/verification.inteface';
import { MailService } from './mail.service';
import { JwtPayload, Tokens } from './types';
import { VerficationDto } from './Dto/user-signUp.dto';
import { User } from '../user/interfaces/user.interface';
import _ from 'lodash';
import { use } from 'passport';
import { Success } from './doc/types/success.return.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly userRepository: userRepository,
  ) {}

  async sendCode(
    verificationDto: VerficationDto,
  ): Promise<Success | undefined> {
    const varification = await this.authRepository.findVarification(
      verificationDto.email,
    );

    if (
      varification &&
      this.isRequestedALot(varification.try, varification.lastResendTime)
    ) {
      throw new BadRequestException('too much request for otp...');
    }

    const otp = await this.generateOtp();

    await this.mailService.sendOtp(otp, verificationDto.email);
    const hashedOtp = await Hash.hash(otp + '');

    const verification1 = await this.authRepository.upsertVarification(
      verificationDto,
      hashedOtp,
    );

    return { success: true };
  }

  async logIn(userLogInDto: UserLoginDto) {
    const user = await this.userRepository.find(userLogInDto.email);
    if (!user) {
      throw new BadRequestException("credintals aren't correct...");
    }

    const isPasswordValid = await Hash.compare(
      userLogInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException("credintals aren't correct...");
    }

    const tokens = await this.getTokens(user);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return { tokens, user };
  }

  async logOut(userId: number): Promise<boolean> {
    const isLogeddOut = await this.authRepository.logOut(userId);
    return isLogeddOut;
  }

  async signUp(signUPDto: SignUpDto): Promise<Tokens> {
    const userExists = await this.userRepository.find(signUPDto.email);

    if (userExists) {
      throw new BadRequestException(
        'user already exists with this email,Please login...',
      );
    }

    const verification = await this.authRepository.findVarification(
      signUPDto.email,
    );

    if (!verification) {
      throw new BadRequestException("We haven't sent code to this email");
    }

    const isValid = await this.isValidOtp(signUPDto.otp, verification);

    if (!isValid) {
      throw new BadRequestException("the otp isn't valid ");
    }
    const hashedPassword = await Hash.hash(signUPDto.password);

    const user = await this.userRepository.upsert({
      email: signUPDto.email,
      name: signUPDto.name,
      password: hashedPassword,
    });

    const tokens = await this.getTokens(user);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  isRequestedALot(numberOfAttampt: number, lastResendTime: Date): boolean {
    const isPassedTowWeeksFromLastResnd =
      new Date(new Date(lastResendTime)).getTime() +
        2 * 7 * 24 * 60 * 60 * 1000 <
      Date.now();

    return !isPassedTowWeeksFromLastResnd && numberOfAttampt > 30
      ? true
      : false;
  }

  generateOtp(): number {
    const code = Math.floor(Math.random() * 9000 + 1000);
    return code;
  }

  async isValidOtp(otp: number, verification: Verificaition): Promise<boolean> {
    const isExpird = !(
      new Date(new Date(verification.lastResendTime)).getTime() +
        5 * 60 * 1000 >
      Date.now()
    );
    if (isExpird) {
      throw new NotAcceptableException('time has expired...');
    }
    const isValid = await Hash.compare(otp + '', verification.code);
    return isValid;
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<Tokens> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.hashedRT) throw new ForbiddenException('Access Denied');

    const rtMatches = await Hash.compare(refreshToken, user.hashedRT);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: number, refreshToken: string): Promise<void> {
    const hashedRefreshToken: string = await Hash.hash(refreshToken);

    await this.authRepository.updateRtHash(userId, hashedRefreshToken);
  }

  async getTokens(user: User): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: user.id,
      role: user.role,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.SECRET_KEY,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.SECRET_KEY,
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async findById(id: number): Promise<User | undefined> {
    return await this.userRepository.findById(id);
  }

  // forget password sequence of requests
  async generateUniqueLink(email: string) {
    const user = await this.userRepository.find(email);

    if (!user) {
      throw new BadRequestException('bad request');
    }

    const secret = process.env.SECRET_KEY + user.password;
    const jwtPayload: JwtPayload = { sub: user.id, role: user.role };
    const token = await this.jwtService.sign(jwtPayload, {
      secret: secret,
      expiresIn: '15m',
    });
    const link = `${process.env.FRONTEND_URL}/auth/resetPassword/${user.id}/${token}`;

    await this.mailService.send(link, email);
    return { sucess: true };
  }
  async validateResetPasswordToken(id: number, token: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new BadRequestException('bad request has been sent...');
    }

    const secret = process.env.SECRET_KEY + user.password;

    try {
      const payload = await this.jwtService.verify(token, { secret: secret });
      return { sucess: true };
    } catch (error) {
      return { message: 'some thing is manipulated Or link is expired...' };
    }
  }

  async updatePassword(password: string, id: number, token: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new BadRequestException('bad request has been sent...');
    }

    const secret = process.env.SECRET_KEY + user.password;

    try {
      const payload = await this.jwtService.verify(token, { secret: secret });
      const hashedPassword = await Hash.hash(password);

      const resetdPasswordUser = await this.userRepository.updatePassword(
        id,
        hashedPassword,
      );

      return { sucess: true };
    } catch (error) {
      return { message: 'some thing is manipulated Or link is expired...' };
    }
  }
}
