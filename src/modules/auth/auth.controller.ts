import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto, VerficationDto } from './Dto/user-login.Dto';
import { UserSignUpDto } from './Dto/user-signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post("/signup")
  async signUp(@Body() userSignInDto: UserSignUpDto) {
    return await this.authService.signUp(userSignInDto);
  }

  @Post("/verify")
  async verify(@Body() verificationDto: VerficationDto, @Res() res) {
    const jwt = await this.authService.verifyOtp(verificationDto);
    console.log(jwt);
    res.cookie('access-token', jwt);
  }

  @Post("/login")
  async login(@Body() userLogInDto: UserLoginDto,@Res() res) {
   const jwt= await this.authService.logIn(userLogInDto);
   console.log(jwt);
   res.cookie('access-token', jwt);
  }
}
