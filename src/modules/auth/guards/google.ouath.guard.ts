import { AuthGuard } from '@nestjs/passport';
import { extend } from 'lodash';

export class googleOAuthGuard extends AuthGuard('google') {
  constructor() {
    super();
  }
}
