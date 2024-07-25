import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    console.log(user)
    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized!!!');
    }

    const request = context.switchToHttp().getRequest<Request>();
    request.user = user;
    return user;
  }
}