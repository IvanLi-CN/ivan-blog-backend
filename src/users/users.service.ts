import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {UserRepositoryToken} from './users.providers';
import {Repository} from 'typeorm';
import {User} from './user.entity';
import {AuthService} from '../core/auth/auth.service';
import {LoggedUserDto} from '../core/auth/dtos/logged-user.dto';
import {LoggedAdminDto} from '../core/auth/dtos/logged-admin.dto';
import {UserLoggingDto} from './dtos/user-logging.dto';
import * as bcrypt from 'bcrypt';
import {UserRegisterDto} from './dtos/user-register.dto';
import {UpdateUserDto} from './dtos/update-user.dto';
import {AdminUpdateUserDto} from './dtos/admin-update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepositoryToken)
    private userRepository: Repository<User>,
    private authService: AuthService,
  ) {
  }

  async login({email, password}: UserLoggingDto): Promise<LoggedUserDto> {
    const user = await this.userRepository.findOne({
      where: {email},
      select: ['group', 'name', 'password', 'id'],
    });
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const {id, group} = user;
        return {email, id, group};
      }
    }
    throw new NotAcceptableException('登录失败，用户名或密码错误！');
  }

  async verifyNameAvailability(name: string) {
    const user = await this.userRepository.count({name});
    return !user;
  }

  async verifyEmailAvailability(email: string) {
    const user = await this.userRepository.count({email});
    return !user;
  }

  async registerUser({email, name, password}: UserRegisterDto) {
    const results = await Promise.all([
      this.verifyEmailAvailability(email),
      this.verifyNameAvailability(name),
    ]);
    if (!results[0]) {
      throw new ConflictException('电子邮箱已存在！');
    }
    if (!results[1]) {
      throw new ConflictException('用户名已存在！');
    }
    return await this.userRepository.save(
      this.userRepository.create({email, name, password: await bcrypt.hash(password, 10)}),
    );
  }

  async updateUser({name, oldPassword, newPassword}: UpdateUserDto, userId: number) {
    const user = await this.userRepository.findOne(userId, {select: ['name', 'email', 'password']});
    if (!user) {
      throw new NotFoundException('该用户不存在！');
    }

    if (!await bcrypt.compare(oldPassword, user.password)) {
      throw new UnauthorizedException('原密码不正确！');
    }
    const rt = await this.userRepository.update(userId, {
      name, password: newPassword ? await bcrypt.hash(newPassword, 10) : undefined,
    });
    if (rt.raw.changedRows !== 1) {
      throw new InternalServerErrorException('修改用户信息时出现未知问题！');
    }
  }

  async updateUserByAdmin(userId: number, {name, password, email}: AdminUpdateUserDto) {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('该用户不存在！');
    }
    const rt = await this.userRepository.update(userId, {
      name, password: password ? await bcrypt.hash(password, 10) : undefined, email,
    });
    if (rt.raw.changedRows !== 1) {
      throw new InternalServerErrorException('修改用户信息时出现未知问题！');
    }
  }

  createAccessToken4User(user: LoggedUserDto) {
    return this.authService.sign4User(user);
  }

  createAccessToken4Admin(admin: LoggedAdminDto) {
    return this.authService.sign4Admin(admin);
  }

  createRefreshToken(user: LoggedUserDto) {
    return this.authService.signRefreshToken(user);
  }
}
