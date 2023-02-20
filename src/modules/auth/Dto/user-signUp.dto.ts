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

export class VerficationDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}

export class SignUpDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1000, { message: "otp shouldn't be less then 4 numbers" })
  @Max(9999, { message: "otp shouldn't be more then 4 numbers" })
  otp: number;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6, { message: 'password should be  more  than 6 characters' })
  @MaxLength(30, { message: 'password shouldn be less than 30 characters' })
  password: string;

  @ApiProperty()
  @Validate(CustomMatchPasswords, ['password'])
  passwordConfirm: string;
}
