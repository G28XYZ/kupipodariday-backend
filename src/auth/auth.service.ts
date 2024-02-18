import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigurationService } from 'src/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigurationService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return await this.generateToken(user.id);
  }

  async generateToken(userId: number) {
    return {
      access_token: await this.jwtService.signAsync(
        { id: userId },
        { secret: this.configService.get('jwtSecret') },
      ),
    };
  }

  async login({ username, password }: LoginUserDto) {
    const user = await this.userService.findOne(username, ['password', 'id']);
    console.log(user);
    if (!user) {
      throw new UnauthorizedException('NOT_FOUND_ERROR'); // TODO - const err
    }
    const isComparePassword = await compare(password, user.password);
    if (isComparePassword === false) {
      throw new UnauthorizedException('PASSWORD_ERROR'); // TODO - const err
    }
    return await this.generateToken(user.id);
  }
}
