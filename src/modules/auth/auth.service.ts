import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { UserSignUpDto } from './Dto/user-signUp.dto';
import * as bcrypt from 'bcrypt';
import { OtpService } from './otp.service';
import { UserLoginDto, VerficationDto } from './Dto/user-login.Dto';
import { Verificaiton } from './interfaces/verification.inteface';
import { userRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { Hash } from 'src/utils/Hash';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    private readonly userRepository: userRepository,
  ) {}

  async signUp(userSignInDto: UserSignUpDto) {
    const varification = await this.authRepository.findVarification(
      userSignInDto.email,
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
      userSignInDto,
      hashedOtp,
    );

    const hashedPassword = await Hash.hash(userSignInDto.password);
    const user = await this.userRepository.upsert({
      email: userSignInDto.email,
      name: userSignInDto.name,
      password: hashedPassword,
      status: 'unverified',
    });

    return;
  }

  async logIn(userLogInDto: UserLoginDto): Promise<string> {
    const user = await this.userRepository.find(userLogInDto.email);
    const isPasswordValid = await Hash.compare(
      userLogInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException("credintals arn't correct...");
    }
    return await this.generateJwt(user.id);
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
    return this.generateJwt(user.id);
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
    const test = await bcrypt.compare(otp + '', verification.code);
    console.log(test);
    return test;
  }

  async generateJwt(id: number) {
    const secret = (await process.env.SECRET_KEY) as string;
    return this.jwtService.sign({ id: id });
  }
}

