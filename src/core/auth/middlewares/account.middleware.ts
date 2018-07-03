import {Injectable, NestMiddleware, UnauthorizedException,} from '@nestjs/common';
import {AuthService} from '../auth.service';
import {FunctionMiddleware} from '@nestjs/common/interfaces/middlewares';
import {AppRequest} from '../../models/app-request.model';
import {LoggedUserGroups} from '../enums/LoggedUserGroups';
import {LoggedAdminDto} from '../dtos/logged-admin.dto';
import {LoggedUserDto} from '../dtos/logged-user.dto';

@Injectable()
export class AccountMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  resolve(context: string): FunctionMiddleware {
    return (req: AppRequest, res, next) => {
      const authorization = req.headers.authorization;
      if (!authorization) {
        return next();
      }
      const obj = this.authService.getAccount(authorization);
      if (obj.group === LoggedUserGroups.admin) {
        const admin = obj as LoggedAdminDto;
        req.admin = admin;
        req.user = admin;
        req.userId = admin.id;
      } else if (obj.group === LoggedUserGroups.member) {
        const member = obj as LoggedUserDto;
        req.member = member;
        req.user = member;
        req.userId = member.id;
      } else {
        throw new UnauthorizedException('未知的身份！');
      }
      if (!req.userId) throw new UnauthorizedException('凭据负载不完整！');
      next();
    };
  }
}
