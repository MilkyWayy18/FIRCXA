import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class RtGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    console.log('Guard Error:', err); // Log error
    console.log('Guard User:', user); // Log user

    if (err || !user) {
      throw err || new UnauthorizedException('error!!!');
    }
    
    const request = context.switchToHttp().getRequest<Request>();
    request.user = user;
    return user;
  }
}


