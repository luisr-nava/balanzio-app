import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export const GetUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): any => {
    const req = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
    const user = req.user;
    return data ? user?.[data] : user;
  },
);