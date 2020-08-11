import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const AuthTokenSetter = createParamDecorator((data, context: ExecutionContext) => {
  return async (token: string) => {
    const ctx = GqlExecutionContext.create(context);
    const res = ctx.getContext().res;
    res.append('authorization', `bearer ${token}`);
    res.cookie('auto-login', token);
  };
});
