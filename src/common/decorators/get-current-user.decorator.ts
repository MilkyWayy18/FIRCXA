import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadWithRt } from 'src/types';

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    // console.log('Request User:', request.user);
    if (!data) return request.user ;
    // console.log(request.user[data])
    return request.user[data];
  },
);
