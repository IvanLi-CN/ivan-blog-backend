import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { FunctionMiddleware } from '@nestjs/common/interfaces/middlewares';
import { AppRequest } from '../../models/app-request.model';

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
        req.userId = admin.id;
      } else if (obj.group === LoggedUserGroups.user) {
        const user = obj as LoggedUserDto;
        req.user = user;
        req.userId = user.id;
      } else {
        throw new UnauthorizedException('未知的身份！');
      }
      if (!req.userId) throw new UnauthorizedException('凭据负载不完整！');
      next();
    };
  }
}
