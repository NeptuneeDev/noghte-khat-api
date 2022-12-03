import { Controller, Get, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";


@Controller("user")
export class UserController{

    constructor (private readonly userService:UserService){}

}