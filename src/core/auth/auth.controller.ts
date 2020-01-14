// import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
// import { UserLoginWithPasswordDto } from './dtos/user-login-with-password.dto';
// import { AuthService } from './auth.service';
// import { UserLoginWithCaptchaDto } from './dtos/user-login-with-captcha.dto';
// import { SystemRoles } from './account-types.enum';
//
// @Controller()
// export class AuthController {
//   constructor(
//     private authService: AuthService,
//     private smsCaptchaService: SmsCaptchaService,
//     private userService: UsersService,
//     private adminsService: AdminsService,
//   ) {
//   }
//
//   @Post('login-with-password')
//   async loginWithPassword(
//     @Body() dto: UserLoginWithPasswordDto,
//     @Res() res: Response,
//   ) {
//
//   }
//
//   @Post('login-with-captcha')
//   async loginWithCaptcha(
//     @Body() dto: UserLoginWithCaptchaDto,
//     @Res() res: Response,
//   ) {
//     if (!this.smsCaptchaService.verifySmsCaptcha(dto.phone, dto.captcha)) {
//       throw new HttpException({
//         status: HttpStatus.BAD_REQUEST,
//         message: '验证码错误',
//         error: 'Wrong Captcha',
//       }, HttpStatus.BAD_REQUEST);
//     }
//     const user = await this.userService.getOneOrAutoRegister(dto.phone);
//     const token = await this.authService.sign4Member({id: user.id, permissions: user.permissions, systemRole: null});
//     res.append('authorization', `bearer ${token}`);
//     res.cookie('auto-login', await this.authService.sign4Member({id: user.id, permissions: user.permissions, systemRole: null}, '1d'));
//     res.send({
//       id: user.id,
//       phone: user.phone,
//       hasPassword: !!user.password,
//     });
//     res.end();
//   }
//
//   @Post('login-as-admin')
//   async loginAsAdmin(
//     @Body() loginDto: LoginAsAdminDto,
//     @Res() res: Response,
//   ) {
//     const admin = await this.adminsService.compareUsernameAndPassword(loginDto.username, loginDto.password);
//     if (!admin) {
//       throw new BadRequestException('用户名或对应的口令错误！');
//     }
//     const token = await this.authService.sign4Admin({id: admin.id, permissions: admin.permissions, systemRole: null});
//     res.cookie('auto-login', await this.authService.sign4Admin({id: admin.id, permissions: admin.permissions, systemRole: null}, '1h'));
//     res.append('authorization', `bearer ${token}`);
//     res.send({
//       ...admin,
//     });
//     res.end();
//   }
//
//   @Get('logout')
//   logout(
//     @Req() req: AppRequest,
//     @Res() res: Response,
//   ) {
//     res.clearCookie('auto-login');
//     res.end();
//   }
//
//   @Get('auto-login')
//   async autoLogin(
//     @Req() req: AppRequest,
//     @Res() res: Response,
//   ) {
//     const user = await this.authService.getAccount('Bearer ' + req.cookies['auto-login']);
//     let token: string;
//     let info;
//     switch (user.systemRole) {
//       case SystemRoles.member:
//         info = await this.userService.getOne(user.id);
//         token = await this.authService.sign4Member({id: user.id, permissions: user.permissions, systemRole: null});
//         break;
//       case SystemRoles.admin:
//         info = await this.adminsService.getOne(user.id);
//         token = await this.authService.sign4Admin({id: user.id, permissions: user.permissions, systemRole: null});
//         break;
//     }
//     res.append('authorization', `bearer ${token}`);
//     res.send(Object.assign({}, info, user));
//     res.end();
//   }
//
// }
