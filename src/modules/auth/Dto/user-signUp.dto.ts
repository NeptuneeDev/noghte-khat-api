import {
  IsEmail,
  IsNotEmpty,
  IsString,
  matches,
  MATCHES,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserSignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'password should be ' })
  @MaxLength(30, { message: "password shouldn't be more than 30 characters" })
  password: string;

  // @Dose
  // confirmPassword
}
