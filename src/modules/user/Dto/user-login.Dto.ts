import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, minLength } from "class-validator";


export class UserLoginDto {

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email : String;

    @IsNotEmpty()
    @MinLength(6,{message:"password should be "})
    @MaxLength(30,{message:"password shouldn't be more than 30 characters"})
    password: String;

}