import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '../types';
import { request, Request } from 'express';
import { userRepository } from 'src/modules/user/user.repository';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userRepository: userRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => this.jwtExtractor(req),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return { sub: payload.sub, role: payload.role, name: payload.name };
  }

  jwtExtractor(request: Request): string | null {
    const token = request?.cookies['access_token'];
    if (!token) return null;

    return token;
  }
}
