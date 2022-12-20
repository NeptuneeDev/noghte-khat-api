import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { SignUpDto } from './Dto/user-signUp.dto';
import { OtpService } from './otp.service';
import { UserLoginDto } from './Dto/user-login.Dto';
import { Verificaiton } from './interfaces/verification.inteface';
import { userRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { Hash } from 'src/utils/Hash';
import { Tokens } from './types/tokens.type';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './types';
import { VerficationDto } from './Dto/user-signUp.dto';
import { User } from '../user/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    private readonly userRepository: userRepository,
  ) {}

  async sendCode(verificationDto: VerficationDto) {
    const varification = await this.authRepository.findVarification(
      verificationDto.email,
    );

    if (
      varification &&
      this.isRequestedALot(varification.try, varification.lastResendTime)
    ) {
      throw new BadRequestException('too much request for otp...');
    }

    const otp = this.generateOtp();

    this.otpService.send(otp);
    const hashedOtp = await Hash.hash(otp + '');

    const verification1 = await this.authRepository.upsertVarification(
      verificationDto,
      hashedOtp,
    );

    return verification1;
  }

  async logIn(userLogInDto: UserLoginDto) {
    const user = await this.userRepository.find(userLogInDto.email);
    if (!user) {
      throw new ForbiddenException('user not found!');
    }

    const isPasswordValid = await Hash.compare(
      userLogInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException("credintals arn't correct...");
    }

    const tokens = await this.getTokens(user.id);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return { tokens, user };
  }

  async logOut(userId: number): Promise<boolean> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRT: null,
      },
    });
    return true;
  }

  async signUp(signUPDto: SignUpDto): Promise<Tokens> {
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
      status: 'verified',
    });

    const tokens = await this.getTokens(user.id);
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
    console.log(code);
    return code;
  }

  async isValidOtp(otp: number, verification: Verificaiton): Promise<boolean> {
    const isExpird = !(
      new Date(new Date(verification.lastResendTime)).getTime() +
        5 * 60 * 1000 >
      Date.now()
    );
    if (isExpird) {
      throw new NotAcceptableException('time has expired...');
    }
    const test = await Hash.compare(otp + '', verification.code);
    console.log(test);
    return test;
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.hashedRT) throw new ForbiddenException('Access Denied');

    const rtMatches = await Hash.compare(rt, user.hashedRT);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash: string = await Hash.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRT: hash,
      },
    });
  }

  async getTokens(userId: number): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.SECRET_KEY,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.SECRET_KEY,
        expiresIn: '24h',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async validateUser(userId: number): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }
}

// sendCode email         error {}
// signup email name password confirmpassword otp
