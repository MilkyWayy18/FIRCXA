import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CreateDto } from 'src/modules/user/dto';

export const CustomBody = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.body;
  },
);