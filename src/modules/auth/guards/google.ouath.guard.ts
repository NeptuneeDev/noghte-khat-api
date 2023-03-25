import { AuthGuard } from '@nestjs/passport';

export class googleOAuthGuard extends AuthGuard('google') {
  constructor() {
    super();
  }
}
