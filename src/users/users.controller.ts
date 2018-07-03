import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import {UsersService} from './users.service';
import {UserRegisterDto} from './dtos/user-register.dto';

import {ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags} from '@nestjs/swagger';
import {UserLoggingDto} from './dtos/user-logging.dto';
import {AppRequest} from '../core/models/app-request.model';
import {UpdateUserDto} from './dtos/update-user.dto';
import {LoggedUserGroups} from '../core/auth/enums/LoggedUserGroups';
import {LoggedAdminDto} from '../core/auth/dtos/logged-admin.dto';
import {LoggedUserInfoDto} from './dtos/logged-user-info.dto';
import {Roles} from '../core/auth/roles.decorator';
import {LuocaptchaGuard} from '../core/luocaptcha/luocaptcha.guard';

@ApiUseTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private service: UsersService,
  ) {
  }

  @Post()
  @ApiOperation({title: '注册新用户', description: '用于注册普通用户'})
  @ApiResponse({status: HttpStatus.NO_CONTENT, description: '用户注册成功。'})
  @ApiResponse({status: HttpStatus.CREATED, description: '用户注册成功，并取得登录信息。'})
  @ApiResponse({status: HttpStatus.CONFLICT, description: '用户名或（和）电子邮箱已存在。'})
  async register(@Body() userRegisterDto: UserRegisterDto) {
    const {email, name, group, id} = await this.service.registerUser(userRegisterDto);
    const accessToken = this.service.createAccessToken4User({email, id, group});
    const refreshToken = this.service.createRefreshToken({email, group, id});
    return {accessToken, refreshToken, ...{email, name, group, id}};
  }

  @Post('token')
  @ApiOperation({title: '用户登录'})
  @UseGuards(LuocaptchaGuard)
  @ApiResponse({status: HttpStatus.CREATED, description: '用户登录成功。'})
  @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: '用户登录失败。'})
  async getTokens(@Body() userLoginDto: UserLoggingDto): Promise<LoggedUserInfoDto> {
    const user = await this.service.login(userLoginDto);
    switch (user.group) {
      case LoggedUserGroups.admin: {
        const accessToken = this.service.createAccessToken4Admin(user as LoggedAdminDto);
        const refreshToken = this.service.createRefreshToken(user);
        return {accessToken, refreshToken, ...user};
      }
      case LoggedUserGroups.member: {
        const accessToken = this.service.createAccessToken4User(user);
        const refreshToken = this.service.createRefreshToken(user);
        return {accessToken, refreshToken, ...user};
      }
      default:
        throw new ForbiddenException('登录失败！当前账户无权获取登录凭据！');
    }
  }

  // async refreshTokens(@Req() {user, admin}: AppRequest) {
  //   if (user) {
  //
  //   }
  // }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({title: '修改用户信息'})
  @ApiResponse({status: HttpStatus.NO_CONTENT, description: '用户信息修改成功。'})
  @ApiResponse({status: HttpStatus.FORBIDDEN, description: '无权修改用户信息。'})
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: '找不到目标用户。'})
  @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: '原密码验证不通过。'})
  @Roles(LoggedUserGroups.member, LoggedUserGroups.admin)
  async updateUserInfo(
    @Body() updateUserDto: UpdateUserDto,
    @Req() {userId, admin}: AppRequest,
    @Param('id', ParseIntPipe) id: number) {
    if (id === userId) {
      return await this.service.updateUser(updateUserDto, userId);
    } else if(admin){
      return await this.service.updateUserByAdmin(id, updateUserDto);
    } else {
      throw new ForbiddenException('无权修改该用户的信息！');
    }
  }

  @Get('name/:name/available')
  @ApiOperation({title: '获取用户名可用性'})
  @ApiResponse({status: HttpStatus.OK, description: '用户名可用'})
  async verifyNameAvailability(@Param('name') name: string){
    return {available: await this.service.verifyNameAvailability(name)};
  }
  @Get('email/:email/available')
  @ApiOperation({title: '获得电子邮箱可用性'})
  @ApiResponse({status: HttpStatus.OK, description: '电子邮箱可用'})
  async verifyEmailAvailability(@Param('email') email: string){
    return {available: await this.service.verifyEmailAvailability(email)};
  }

}
