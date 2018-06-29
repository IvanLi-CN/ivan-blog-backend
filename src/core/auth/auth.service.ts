import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPrivateKeyToken, JwtPublicKeyToken } from './auth.providers';
import * as JWT from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtPrivateKeyToken) private readonly privateKey: string,
    @Inject(JwtPublicKeyToken) private readonly publicKey: string,
  ) {}

  verify(
    token: string,
  ): LoggedUserDto | LoggedAdminDto {
    return JWT.verify(token, this.publicKey) as any;
  }

  sign4User({ nickName, id }: LoggedUserDto) {
    return JWT.sign(
      { name, id, group: LoggedUserGroups.user },
      this.privateKey,
      { expiresIn: '15m' },
    );
  }

  sign4Admin({ nickName, id }: LoggedAdminDto) {
    return JWT.sign(
      { name, id, group: LoggedUserGroups.admin },
      this.privateKey,
      { expiresIn: '15m' },
    );
  }

  getAccount(
    authorization: string,
  ): LoggedUserDto | LoggedAdminDto {
    const index = authorization.indexOf('Bearer');
    if (index === -1) {
      throw new UnauthorizedException('身份认证凭据类型不被接受！');
    }
    const token = authorization.substr(index + 7).trim();
    try {
      return this.verify(token);
    } catch (e) {
      throw new UnauthorizedException('非法的身份认证凭据！');
    }
  }
}
