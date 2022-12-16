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
} from 'class-validator';

export class UserLoginDto {
  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6, { message: 'password should be ' })
  @MaxLength(30, { message: "password shouldn't be more than 30 characters" })
  password: string;
}

export class VerficationDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1000, { message: "code shouldn't be less then 4 numbers" })
  @Max(9999, { message: "code shouldn't be more then 4 numbers" })
  otp: number;
}
