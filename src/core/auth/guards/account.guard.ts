import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccountTypes } from '../account-types.enum';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AppRequest } from '../models/app-request.model';

@Injectable()
export class AccountGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const roles = this.reflector.get<AccountTypes[]>('roles', context.getHandler());

    console.log('RoleGuard', roles, ctx.getContext<{req: AppRequest}>().req.user);
    if (!roles) {
      return true;
    }
    if (!ctx.getContext<{req: AppRequest}>().req.user) {
      throw new UnauthorizedException('用户身份未知');
    }
    console.log('RoleGuard', roles, ctx.getContext<{req: AppRequest}>().req.user.role);
    return roles.some(
      (role) =>
        ctx.getContext<{req: AppRequest}>().req.user.role === role,
    );
  }
}
