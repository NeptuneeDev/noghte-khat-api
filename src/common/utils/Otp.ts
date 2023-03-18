import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { Verification } from '@prisma/client';
import clientMessages from '../translation/fa';
import { Hash } from './Hash';

Injectable();
export class Otp {
  generate(): number {
    const code = Math.floor(Math.random() * 9000 + 1000);
    return code;
  }

  async isValid(otp: number, verification: Verification): Promise<boolean> {
    const isExpird = !(
      new Date(new Date(verification.lastResendTime)).getTime() +
        5 * 60 * 1000 >
      Date.now()
    );
    if (isExpird) {
      throw new NotAcceptableException(clientMessages.auth.expiredOtp);
    }
    const isValid = await Hash.compare(otp + '', verification.code);
    return isValid;
  }

  requestesALot(numberOfAttampt: number, lastResendTime: Date): boolean {
    const isPassedTowWeeksFromLastResnd =
      new Date(new Date(lastResendTime)).getTime() +
        2 * 7 * 24 * 60 * 60 * 1000 <
      Date.now();

    return !isPassedTowWeeksFromLastResnd && numberOfAttampt > 10
      ? true
      : false;
  }

  async validate(otp: number, verification: Verification) {
    const isValid = await this.isValid(otp, verification);

    if (!isValid) {
      throw new BadRequestException(clientMessages.auth.tryOtp);
    }
  }
}
