import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SanitizeError } from 'src/http-error-handlers/error.handler';
import { GetCurrentUserId, Public } from '../common/decorators';
import { GetCurrentUser } from '../common/decorators';
import { RtGuard } from '../common/guards/rt.guard';
import { AuthService } from './auth.service';
import { UserLoginDto } from './Dto/user-login.Dto';
import { SignUpDto, VerficationDto } from './Dto/user-signUp.dto';

import { Verificaiton } from './interfaces/verification.inteface';
import { Tokens } from './types/tokens.type';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sendCode')
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.CREATED)
  @SanitizeError({ targetName: '' })
  async sendCode(@Body() verificationDto: VerficationDto) {
    return await this.authService.sendCode(verificationDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() userLogInDto: UserLoginDto, @Res() res) {
    const { atCookie, rtCookie } = await this.authService.logIn(userLogInDto);
    res.cookie('access_token', atCookie, {
      maxAge: 900000,
      httpOnly: true,
    });
    res.cookie('refresh_token', rtCookie, {
      maxAge: 86400000,
      httpOnly: true,
    });
    res.send('logined!');
  }

  @Post('logout')
  @ApiBearerAuth()
  async logout(@GetCurrentUserId() userId: number): Promise<boolean> {
    return this.authService.logOut(userId);
  }

  @Public()
  @Post('signUp')
  async verify(@Body() signUpDto: SignUpDto, @Res() res) {
    const { atCookie, rtCookie } = await this.authService.signUp(signUpDto);
    res.cookie('access_token', atCookie, {
      maxAge: 900000,
      httpOnly: true,
    });
    res.cookie('refresh_token', rtCookie, {
      maxAge: 86400000,
      httpOnly: true,
    });
    res.send({ success: true });
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer + refreshToken',
  })
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshtoken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshtoken);
  }
}
