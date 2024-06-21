import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class RtGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }

  handleRequest(err, user, info, context: ExecutionContext) {

    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    // console.log(user)
    const request = context.switchToHttp().getRequest<Request>();
    request.user = user;
    return user;
  }
}