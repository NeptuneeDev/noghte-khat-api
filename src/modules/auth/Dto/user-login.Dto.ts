import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  minLength,
} from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'password should be ' })
  @MaxLength(30, { message: "password shouldn't be more than 30 characters" })
  password: string;
}

export class VerficationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1000,{message:"code shouldn't be less then 4 numbers"})
  @Max(9999,{message:"code shouldn't be more then 4 numbers"})
  otp: number;
}
