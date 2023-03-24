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
import { CookieOptions, Request, Response } from 'express';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from '../../common/decorators';
import { RtGuard } from './guards/rt.guard';
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
import { UserInit } from './types/user-init.type';
import { UserLoginDto } from './Dto/user-login.Dto';
import { SignUpDto, VerficationDto } from './Dto/user-signUp.dto';
import { AuthGuard } from '@nestjs/passport';
import { googleOAuthGuard } from './guards/google.ouath.guard';
import { GoogleUserInfo } from './types/google.user';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly atExp = 15 * 60 * 1000; // access token expiration time 15m
  private readonly rtExp = 7 * 24 * 60 * 60 * 1000; //refresh token expiration 7d
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
  @Post('signup')
  @ApiSignUpDoc()
  async signup(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signUp(signUpDto);
    this.setCookie(res, 'access_token', tokens.access_token, this.atExp);
    this.setCookie(res, 'refresh_token', tokens.refresh_token, this.rtExp);

    return { success: true };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiLoginDoc()
  async login(@Body() userLogInDto: UserLoginDto, @Res() res: Response) {
    const tokens = await this.authService.logIn(userLogInDto);
    this.setCookie(res, 'access_token', tokens.access_token, this.atExp);
    this.setCookie(res, 'refresh_token', tokens.refresh_token, this.rtExp);

    return res.send({ success: true });
  }

  @Post('logout')
  @ApiLogOutDoc()
  async logout(@Res() res: Response, @GetCurrentUserId() userId: number) {
    const isLoggedOut = await this.authService.logOut(userId);

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
  @Post('sendCode')
  @ApiSendCodeDoc()
  @HttpCode(HttpStatus.CREATED)
  async sendCode(@Body() verificationDto: VerficationDto) {
    return await this.authService.sendCode(verificationDto);
  }

  // auth/google
  @Public()
  @UseGuards(googleOAuthGuard)
  @Get('google')
  async logInBygoogle(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {}


  @Public()
  @Get('google/redirect')
  @UseGuards(googleOAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user: GoogleUserInfo = req.user as any;
    const { firstName, lastName, email } = user;
    const tokens = await this.authService.loginBygoogle({
      firstName,
      lastName,
      email,
    });

    this.setCookie(res, 'access_token', tokens.access_token, this.atExp);
    this.setCookie(res, 'refresh_token', tokens.refresh_token, this.rtExp);

    const url =
      process.env.NODE_ENV !== 'production'
        ? process.env.FRONTEND_URL
        : process.env.ONLIEN_LANDING_PAGE;

    return res.redirect(url);
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
    this.setCookie(res, 'access_token', tokens.access_token, this.atExp);
    this.setCookie(res, 'refresh_token', tokens.refresh_token, this.rtExp);

    return res.send({ sucess: true });
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
