import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../token/types';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies['access_token'];
        }
        console.log('Access Token:', token); 
        return token;
      },
      secretOrKey: 'fircxa18',
      passReqToCallback: false, 
    });
  }

  async validate(payload: JwtPayload) {
    console.log('Validate Payload:', payload); 
    const { sub: userId, email, role } = payload;
    if (!userId || !email) {
      throw new ForbiddenException('Invalid token payload');
    }
    return { userId, email, role };
  }
}