import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, minLength } from "class-validator";


export class UserLoginDto {

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email : String;

}

