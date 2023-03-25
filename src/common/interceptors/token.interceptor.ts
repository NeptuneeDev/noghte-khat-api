import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/modules/auth/types/jwtPayload.type';
// import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const accessToken = request?.cookies['access_token'];

    if (accessToken) {
      const decoded = await this.extractFromJwt(accessToken);
      request.user = decoded;
    }

    return next.handle();
  }
  async extractFromJwt(accessToken: string): Promise<JwtPayload> {
    try {
      const decoded = await this.jwtService.verify(accessToken, {
        secret: process.env.SECRET_KEY,
      });
      return { sub: decoded.sub, role: decoded.role, name: decoded.name };
    } catch (error) {
      return;
    }
  }
}
