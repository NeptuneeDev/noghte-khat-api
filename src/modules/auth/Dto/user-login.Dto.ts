import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import clientMessages from 'src/common/translation/fa';

export class UserLoginDto {
  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({ description: 'password should be', minimum: 6, maximum: 30 })
  @IsNotEmpty()
  @MinLength(8, { message: clientMessages.auth.validation.minPassword })
  @MaxLength(50, { message: clientMessages.auth.validation.maxPassword })
  password: string;
}
// sendCOde email
// siginup  email otp name password confirm password
