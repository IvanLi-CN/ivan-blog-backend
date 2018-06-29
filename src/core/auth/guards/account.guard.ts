import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AccountGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
      return this.checkRoles(context);
  }

  /**
   * Checks if the current user role exists within the specified role set
   * @param {ExecutionContext} context
   * @returns {boolean}
   */
  private checkRoles(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<number[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    return roles.some(
      (role: number) => request[LoggedUserGroups[role]]
      // The role name is the attribute name in the request object and the user information is the attribute value
    );
  }
}
