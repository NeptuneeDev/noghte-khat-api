import { Injectable } from '@nestjs/common';
import { PassportSerializer, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class googleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '526238615169-d1l284ls3u7nanvsn082d1ejk519oe4j.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:5000/auth/google-redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { name, emails } = profile;
    const user = {
      firstName: name.givenName,
      lastName: name.familyName,
      email: emails[0].value,
      accessToken,
    };
    return user;
  }
}
