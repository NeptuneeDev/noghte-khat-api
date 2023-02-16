import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CookieOptions, Response } from 'express';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from '../../common/decorators';
import { RtGuard } from '../../common/guards/rt.guard';
import { AuthService } from './auth.service';
import {
  ForgetPasswordDto,
  ResetPasswordtDto,
} from './Dto/forget.password.dto';
import {
  ApiForgetPasswordDoc,
  ApiLoginDoc,
  ApiLogOutDoc,
  ApiRefreshTokensDoc,
  ApiResetPasswordDoc,
  ApiSendCodeDoc,
  ApiSignUpDoc,
} from './doc/api-response.body';
import { UserInit } from './Dto/user-init.dto';
import { UserLoginDto } from './Dto/user-login.Dto';
import { SignUpDto, VerficationDto } from './Dto/user-signUp.dto';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private setCookie = (
    res: Response,
    name: string,
    value: string,
    maxAge: number,
  ) => {
    const cookieOptions: CookieOptions = {
      maxAge,
      httpOnly: true,
      domain: process.env.NODE_ENV === 'production' ? '.noghteh-khat.ir' : '',
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : false,
    };
    res.cookie(name, value, cookieOptions);
  };

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
  @ApiSendCodeDoc()
  @HttpCode(HttpStatus.CREATED)
  async sendCode(@Body() verificationDto: VerficationDto) {
    return await this.authService.sendCode(verificationDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiLoginDoc()
  async login(@Body() userLogInDto: UserLoginDto, @Res() res: Response) {
    const { tokens, user } = await this.authService.logIn(userLogInDto);
    this.setCookie(res, 'access_token', tokens.access_token, 900000);
    this.setCookie(res, 'refresh_token', tokens.access_token, 86400000);

    return res.send({ name: user.name, email: user.email });
  }

  @Post('logout')
  @ApiLogOutDoc()
  async logout(@Res() res: Response, @Req() req) {
    const isLoggedOut = await this.authService.logOut(req.user.id);

    const clearCookieOptions: CookieOptions = {
      httpOnly: true,
      domain: process.env.NODE_ENV === 'production' ? '.noghteh-khat.ir' : '',
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : false,
    };
    res.clearCookie('access_token', clearCookieOptions);
    res.clearCookie('refresh_token', clearCookieOptions);

    return res.send(isLoggedOut);
  }

  @Public()
  @Post('signup')
  @ApiSignUpDoc()
  async signup(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const tokens = await this.authService.signUp(signUpDto);
    this.setCookie(res, 'access_token', tokens.access_token, 900000);
    this.setCookie(res, 'refresh_token', tokens.access_token, 86400000);

    return res.send({ success: true });
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiRefreshTokensDoc()
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshtoken: string,
    @Res() res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(userId, refreshtoken);
    this.setCookie(res, 'access_token', tokens.access_token, 900000);
    this.setCookie(res, 'refresh_token', tokens.access_token, 86400000);

    return res.send({ success: true });
  }

  @Public()
  @Post('forgetPassword')
  @ApiForgetPasswordDoc()
  async forgetPassword(@Body() body: ForgetPasswordDto) {
    return await this.authService.generateUniqueLink(body.email);
  }

  @Public()
  @ApiResetPasswordDoc()
  @Get('resetPassword/:id/:token')
  async validateResetPasswordToken(
    @Param('id', ParseIntPipe) id: number,
    @Param('token') token: string,
  ) {
    return await this.authService.validateResetPasswordToken(id, token);
  }

  @Public()
  @ApiResetPasswordDoc()
  @Post('resetPassword/:id/:token')
  async RestPassword(
    @Param('id', ParseIntPipe) id: number,
    @Param('token') token: string,
    @Body() body: ResetPasswordtDto,
  ) {
    return await this.authService.updatePassword(body.password, id, token);
  }
}
