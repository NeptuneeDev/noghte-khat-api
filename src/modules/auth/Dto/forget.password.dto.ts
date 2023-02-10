import { ApiProperty } from '@nestjs/swagger';
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

export class ForgetPasswordDto {
  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordtDto {

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6, { message: 'password should be  more  than 6 characters' })
  @MaxLength(30, { message: 'password shouldn be less than 30 characters' })
  password: string;

  @Validate(CustomMatchPasswords, ['password'])
  passwordConfirm: string;
}
