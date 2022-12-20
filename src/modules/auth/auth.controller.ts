import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
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
import { UserInit } from './Dto/user-init.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async init(@Req() req): Promise<UserInit> {
    const user: UserInit = req.user;
    return {
      name: user.name,
      email: user.email,
    };
  }

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
    const { tokens, user } = await this.authService.logIn(userLogInDto);
    res.cookie('access_token', tokens.access_token, {
      maxAge: 900000,
      httpOnly: true,
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 86400000,
      httpOnly: true,
    });
    res.send({
      name: user.name,
      email: user.email,
    });
  }

  @Post('logout')
  @ApiBearerAuth()
  async logout(@Res() res, @Req() req) {
    const isLogouted = await this.authService.logOut(req.user.id);
    res.cookie('access_token', '');
    res.cookie('refresh_token', '');

    res.send(isLogouted);
  }

  @Public()
  @Post('signUp')
  async verify(@Body() signUpDto: SignUpDto, @Res() res) {
    const tokens = await this.authService.signUp(signUpDto);
    res.cookie('access_token', tokens.access_token, {
      maxAge: 900000,
      httpOnly: true,
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 86400000,
      httpOnly: true,
    });
    res.send({ success: true });
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshtoken: string,
    @Res() res,
  ) {
    const tokens = await this.authService.refreshTokens(userId, refreshtoken);
    res.cookie('access_token', tokens.access_token, {
      maxAge: 900000,
      httpOnly: true,
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 86400000,
      httpOnly: true,
    });
    res.send({ success: true });
  }
}
