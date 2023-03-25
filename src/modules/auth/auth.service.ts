import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hash } from 'src/common/utils/Hash';
import { UserLoginDto } from './Dto/user-login.Dto';
import { SignUpDto } from './Dto/user-signUp.dto';
import { AuthRepository } from './auth.repository';
import { JwtPayload, Tokens } from './types';
import { VerficationDto } from './Dto/user-signUp.dto';
import { User } from '../user/interfaces/user.interface';
import { Success } from './doc/types/success.return.type';
import clientMessages from 'src/common/translation/fa';
import { GoogleUserInfo } from './types/google.user';
import { MailService } from '../mail/mail.service';
import { OtpService } from './otp.service';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly otp: OtpService,
  ) {}

  async logIn(userLogInDto: UserLoginDto) {
    const user = await this.userRepository.find(userLogInDto.email);
    if (!user) {
      throw new BadRequestException(clientMessages.auth.invalidCredentials);
    }

    const isPasswordValid = await Hash.compare(
      userLogInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException(clientMessages.auth.invalidCredentials);
    }

    return await this.getTokens({
      sub: user.id,
      role: user.role,
      name: user.name,
    });
  }

  async signUp(signUPDto: SignUpDto): Promise<Tokens> {
    await this.validateEmailForSignUp(signUPDto.email);
    await this.validateVerifications(signUPDto.email, signUPDto.otp);
    const hashedPassword = await Hash.hash(signUPDto.password);

    const user = await this.userRepository.create({
      email: signUPDto.email,
      name: signUPDto.name,
      password: hashedPassword,
    });

    return await this.getTokens({
      sub: user.id,
      role: user.role,
      name: user.name,
    });
  }

  async loginBygoogle(googleUserInfo: GoogleUserInfo): Promise<Tokens> {
    const { firstName, lastName, email } = googleUserInfo;
    const name = firstName + ' ' + lastName;
    const user: Partial<User> = await this.userRepository.upsert({
      email,
      name,
    });

    return await this.getTokens({
      sub: user.id,
      role: user.role,
      name: user.name,
    });
  }

  async logOut(userId: number): Promise<boolean> {
    const isLogeddOut = await this.userRepository.logOut(userId);
    return isLogeddOut;
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<Tokens> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.hashedRT) throw new ForbiddenException('Access Denied');

    const rtMatches = await Hash.compare(refreshToken, user.hashedRT);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    return await this.getTokens({
      sub: user.id,
      role: user.role,
      name: user.name,
    });
  }

  async updateRtHash(userId: number, refreshToken: string): Promise<void> {
    const hashedRefreshToken: string = await Hash.hash(refreshToken);

    await this.userRepository.updateRtHash(userId, hashedRefreshToken);
  }

  async getTokens(jwtPayload: JwtPayload): Promise<Tokens> {
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

    await this.updateRtHash(jwtPayload.sub, rt);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
  async sendCode(
    verificationDto: VerficationDto,
  ): Promise<Success | undefined> {
    await this.validateEmailForSignUp(verificationDto.email);
    const varification = await this.authRepository.findVarification(
      verificationDto.email,
    );

    if (
      varification &&
      this.otp.requestesALot(varification.try, varification.lastResendTime)
    ) {
      throw new BadRequestException(clientMessages.auth.tooMuchOtp);
    }

    const otp = this.otp.generate();

    await this.mailService.sendOtp(otp, verificationDto.email);
    const hashedOtp = await Hash.hash(otp + '');

    await this.authRepository.upsertVarification(verificationDto, hashedOtp);

    return { success: true };
  }

  async generateUniqueLink(email: string) {
    const user = await this.userRepository.find(email);

    if (!user) {
      throw new BadRequestException(clientMessages.auth.notFoundEmail);
    }

    const secret = process.env.SECRET_KEY + user.password;
    const jwtPayload: JwtPayload = {
      sub: user.id,
      role: user.role,
      name: user.name,
    };
    const token = await this.jwtService.sign(jwtPayload, {
      secret: secret,
      expiresIn: '15m',
    });
    const link = `https://noghteh-khat.ir/new-password/${user.id}/${token}`;
    await this.mailService.forgetPassword(link, email);
    return { sucess: true };
  }

  async validateResetPasswordToken(id: number, token: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new BadRequestException(clientMessages.auth.notFoundUser);
    }

    const secret = process.env.SECRET_KEY + user.password;

    try {
      await this.jwtService.verify(token, { secret: secret });
      return { sucess: true };
    } catch (error) {
      return { message: 'some thing is manipulated Or link is expired...' };
    }
  }
  async updatePassword(password: string, id: number, token: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new BadRequestException(clientMessages.auth.notFoundUser);
    }

    const secret = process.env.SECRET_KEY + user.password;

    try {
      await this.jwtService.verify(token, { secret: secret });
      const hashedPassword = await Hash.hash(password);

      await this.userRepository.updatePassword(id, hashedPassword);

      return { sucess: true };
    } catch (error) {
      return { message: 'some thing is manipulated Or link is expired...' };
    }
  }

  async validateEmailForSignUp(email: string): Promise<boolean | undefined> {
    const user = await this.userRepository.find(email);

    if (user) {
      throw new HttpException(clientMessages.auth.alreadyExists, 400);
    }
    return true;
  }

  async validateVerifications(
    email: string,
    otp: number,
  ): Promise<boolean | undefined> {
    const verification = await this.authRepository.findVarification(email);
    if (!verification) {
      throw new BadRequestException(clientMessages.auth.tryOtp);
    }
    await this.otp.validate(otp, verification);

    return true;
  }
}
