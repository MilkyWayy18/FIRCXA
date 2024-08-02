import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log('iddd',request.user.userId)
    return request.user.userId; 
  },
);