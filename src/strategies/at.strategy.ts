import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'fircxa', // config.get<string>('jwtAT.secret')/
      passReqToCallback: false,  
    });
  }

  async validate(payload: JwtPayload) {
    // console.log('Payload:', payload);
    return { userId: payload.sub, email: payload.email };
  }
}
