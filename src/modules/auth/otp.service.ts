import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { Verification } from '@prisma/client';
import clientMessages from 'src/common/translation/fa';
import { Hash } from 'src/common/utils/Hash';

Injectable();
export class OtpService {
  generate(): number {
    return Math.floor(Math.random() * 9000 + 1000);
  }

  async isValid(otp: number, verification: Verification): Promise<boolean> {
    const isExpird =
      Date.now() >
      new Date(verification.lastResendTime).getTime() + 5 * 60 * 1000;

    if (isExpird) {
      throw new NotAcceptableException(clientMessages.auth.expiredOtp);
    }

    return await Hash.compare(`${otp}`, verification.code);
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
