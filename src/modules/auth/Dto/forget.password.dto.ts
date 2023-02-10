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
  @ApiProperty({ description: 'password should be', minimum: 6, maximum: 30 })
  @IsNotEmpty()
  @MinLength(6, { message: 'password should be  more  than 6 characters' })
  @MaxLength(30, { message: 'password shouldn be less than 30 characters' })
  password: string;

  @ApiProperty({ description: 'password should be', minimum: 6, maximum: 30 })
  @Validate(CustomMatchPasswords, ['password'])
  passwordConfirm: string;
}
