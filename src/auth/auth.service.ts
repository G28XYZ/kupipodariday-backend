import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ConfigurationService } from 'src/config';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigurationService,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * регистрация нового пользователя
   * @param createUserDto данные о новом пользователе
   */
  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return await this.generateToken(user);
  }
  /**
   * сгенерировать токен
   * @param id уникальный идентификатор пользователя
   */
  async generateToken({ id, username, email }: User) {
    const payload = { id, username, email };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwtSecret'),
        expiresIn: '1d',
      }),
    };
  }
  /**
   * авторизация пользователя
   * @param id уникальный идентификатор пользователя
   */
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.findByNameOrEmail(
      loginUserDto.username,
    );
    return await this.generateToken(user);
  }
}
