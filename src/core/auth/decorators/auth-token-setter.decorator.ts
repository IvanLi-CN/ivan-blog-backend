import { createParamDecorator } from '@nestjs/common';

export const AuthTokenSetter = createParamDecorator((data, [root, args, ctx, info]) => {
  return async (token: string) => {
    ctx.res.append('authorization', `bearer ${token}`);
    ctx.res.cookie('auto-login', token);
  };
});
