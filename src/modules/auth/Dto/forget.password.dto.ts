import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import { CustomMatchPasswords } from 'src/common/utils/password.utils';
import clientMessages from 'src/common/translation/fa';

export class ForgetPasswordDto {
  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}

export class ResetPasswordtDto {
  @ApiProperty({ description: 'password should be', minimum: 6, maximum: 30 })
  @IsNotEmpty()
  @MinLength(8, { message: clientMessages.auth.validation.minPassword })
  @MaxLength(50, { message: clientMessages.auth.validation.maxPassword })
  password: string;

  @ApiProperty({ description: 'password should be', minimum: 6, maximum: 30 })
  @Validate(CustomMatchPasswords, ['password'])
  passwordConfirm: string;
}
