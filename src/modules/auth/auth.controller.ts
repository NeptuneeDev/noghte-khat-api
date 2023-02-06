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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId, Public } from '../../common/decorators';
import { GetCurrentUser } from '../../common/decorators';
import { RtGuard } from '../../common/guards/rt.guard';
import { UserInit } from './Dto/user-init.dto';
import { UserLoginDto } from './Dto/user-login.Dto';
import { SignUpDto, VerficationDto } from './Dto/user-signUp.dto';
import { AuthService } from './auth.service';

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
      role: user.role,
    };
  }

  @Public()
  @Post('sendCode')
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.CREATED)
  async sendCode(@Body() verificationDto: VerficationDto) {
    return await this.authService.sendCode(verificationDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
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
    return res.send({
      name: user.name,
      email: user.email,
    });
  }

  @Post('logout')
  @ApiBearerAuth()
  async logout(@Res() res, @Req() req) {
    const isLoggedOut = await this.authService.logOut(req.user.id);
    res.cookie('access_token', '');
    res.cookie('refresh_token', '');

   return res.send(isLoggedOut);
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
   return res.send({ success: true });
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
   return res.send({ success: true });
  }
}
