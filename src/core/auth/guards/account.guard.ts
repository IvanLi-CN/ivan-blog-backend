import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {Observable} from 'rxjs';
import {LoggedUserGroups} from '../enums/LoggedUserGroups';

@Injectable()
export class AccountGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
      return this.checkRoles(context);
  }

  /**
   * Checks if the current users role exists within the specified role set
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
      // The role name is the attribute name in the request object and the users information is the attribute value
    );
  }
}
