import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserSignUpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8, { message: 'password should be 8 characters' })
  @MaxLength(30, { message: "password shouldn't be more than 30 characters" })
  password: string;

  // @Dose
  // confirmPassword
}
