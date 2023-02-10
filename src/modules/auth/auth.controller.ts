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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUserId, Public } from '../../common/decorators';
import { GetCurrentUser } from '../../common/decorators';
import { RtGuard } from '../../common/guards/rt.guard';
import { UserInit } from './Dto/user-init.dto';
import { UserLoginDto } from './Dto/user-login.Dto';
import { SignUpDto, VerficationDto } from './Dto/user-signUp.dto';
import { AuthService } from './auth.service';
import {
  ForgetPasswordDto,
  ResetPasswordtDto,
} from './Dto/forget.password.dto';
import { Verificaition } from './interfaces/verification.inteface';
import { Success } from './types/success.return.type';
import {
  ApiForgetPasswordDoc,
  ApiLoginDoc,
  ApiLogOutDoc,
  ApiRefreshTokensDoc,
  ApiResetPasswordDoc,
  ApiSendCodeDoc,
  ApiSignUpDoc,
} from './doc/api-response.body';
import { Response } from 'express';
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
    res.cookie('access_token', tokens.access_token, {
      maxAge: 900000,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 86400000,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
    return res.send({
      name: user.name,
      email: user.email,
    });
  }

  @Post('logout')
  @ApiLogOutDoc()
  async logout(@Res() res, @Req() req) {
    const isLoggedOut = await this.authService.logOut(req.user.id);
    res.cookie('access_token', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
    res.cookie('refresh_token', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });

    return res.send(isLoggedOut);
  }

  @Public()
  @Post('signUp')
  @ApiSignUpDoc()
  async verify(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const tokens = await this.authService.signUp(signUpDto);
    res.cookie('access_token', tokens.access_token, {
      maxAge: 900000,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 86400000,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
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
    @Res() res,
  ) {
    const tokens = await this.authService.refreshTokens(userId, refreshtoken);
    res.cookie('access_token', tokens.access_token, {
      maxAge: 900000,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 86400000,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
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
