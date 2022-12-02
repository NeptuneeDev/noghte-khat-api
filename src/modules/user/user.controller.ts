import { Controller, Get, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserSignInDto } from "./Dto/user-signin.dto";
import { UserService } from "./user.service";


@Controller("user")
export class UserController{

    constructor (private readonly userService:UserService){}

    @Get()
    @UsePipes(ValidationPipe)
    async singin(user:UserSignInDto){
        return "hey there"
    }
}