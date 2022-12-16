import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId, Public } from '../common/decorators';
import { GetCurrentUser } from '../common/decorators';
import { AtGuard } from '../common/guards/at.guard';
import { RtGuard } from '../common/guards/rt.guard';
import { AuthService } from './auth.service';
import { UserLoginDto, VerficationDto } from './Dto/user-login.Dto';
import { UserSignUpDto } from './Dto/user-signUp.dto';
import { Tokens } from './types/tokens.type';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() userSignInDto: UserSignUpDto) {
    return await this.authService.signUp(userSignInDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() userLogInDto: UserLoginDto, @Res() res) {
    const tokens = await this.authService.logIn(userLogInDto);
    res.cookie('Authorization', tokens);
    res.send(tokens);
  }

  @Post('logout')
  async logout(@GetCurrentUserId() userId: number): Promise<boolean> {
    return this.authService.logOut(userId);
  }

  @Public()
  @Post('verify')
  async verify(@Body() verificationDto: VerficationDto, @Res() res) {
    const jwt = await this.authService.verifyOtp(verificationDto);
    res.cookie('access-token', jwt);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshtoken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshtoken);
  }
}
