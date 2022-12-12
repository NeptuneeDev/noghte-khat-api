import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserLoginDto, VerficationDto } from './Dto/user-login.Dto';
import { UserSignUpDto } from './Dto/user-signUp.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() userSignInDto: UserSignUpDto) {
    return await this.authService.signUp(userSignInDto);
  }

  @Post('/verify')
  async verify(@Body() verificationDto: VerficationDto, @Res() res) {
    const jwt = await this.authService.verifyOtp(verificationDto);
    console.log(jwt);
    res.cookie('access-token', jwt);
  }

  @ApiResponse({ status: 201, description: 'Successful Login' })
  @Post('/login')
  async login(@Body() userLogInDto: UserLoginDto, @Res() res) {
    const jwt = await this.authService.logIn(userLogInDto);
    console.log(jwt);
    res.cookie('access-token', jwt);
  }

  //doc use case  activity diagram
  //doc swagger
  // 20
  
}
