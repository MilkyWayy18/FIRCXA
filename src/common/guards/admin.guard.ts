import { Injectable, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) {
      return true;
    }

    // Call the base class canActivate to handle JWT authentication
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized!!!');
    }

    const request = context.switchToHttp().getRequest<Request>();
    request.user = user;

    if (user.role !== 'admin') {
      throw new ForbiddenException('Unauthorized access - admin role required');
    }

    return user;
  }
}