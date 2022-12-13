import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { UserSignUpDto } from './Dto/user-signUp.dto';
import { OtpService } from './otp.service';
import { UserLoginDto, VerficationDto } from './Dto/user-login.Dto';
import { Verificaiton } from './interfaces/verification.inteface';
import { userRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { Hash } from 'src/utils/Hash';
import { Tokens } from './types/tokens.type';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    private readonly userRepository: userRepository,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto) {
    /*const varification = await this.authRepository.findVarification(
      userSignUpDto.email,
    );

    ///////////come back here later
    if (
      varification &&
      this.isRequestedALot(varification.try, varification.lastResendTime)
    ) {
      throw new Error();
    }

    const otp = this.generateOtp();

    this.otpService.send(otp);
    const hashedOtp = await Hash.hash(otp + '');

    const verification1 = await this.authRepository.upsertVarification(
      userSignUpDto,
      hashedOtp,
    );*/

    const hashedPassword = await Hash.hash(userSignUpDto.password);

    const user = await this.userRepository.upsert({
      email: userSignUpDto.email,
      name: userSignUpDto.name,
      password: hashedPassword,
      status: 'unverified',
    });

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return;
  }

  async logIn(userLogInDto: UserLoginDto): Promise<Tokens> {
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

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
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

  async verifyOtp(verificationDto: VerficationDto) {
    const verification = await this.authRepository.findVarification(
      verificationDto.email,
    );

    if (!verification) {
      throw new BadRequestException("We haven't sent code to this email");
    }

    const isValid = await this.isValidOtp(verificationDto.otp, verification);

    if (!isValid) {
      throw new BadRequestException("the otp isn't valid ");
    }
    const user = await this.userRepository.find(verificationDto.email);
    return this.getTokens(user.id, user.email);
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

    const tokens = await this.getTokens(user.id, user.email);
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

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.SECRET_KEY,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.SECRET_KEY,
        expiresIn: '10h',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
