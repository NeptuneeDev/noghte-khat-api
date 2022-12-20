import {
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthService } from 'src/modules/auth/auth.service';
import { Hash } from 'src/utils/Hash';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || info || !user) {
      throw err || info || new UnauthorizedException('Access Denied.');
    }

    return user;
  }
}
