import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { compare, genSalt, hash } from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ password, ...createUserDto }: CreateUserDto) {
    return this.userService.create({
      ...createUserDto,
      password: await hash(password, await genSalt(10)), // TODO - constants salt
    });
  }

  async login({ username, password }: LoginUserDto) {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new UnauthorizedException('NOT_FOUND_ERROR'); // TODO - const err
    }
    const isComparePassword = await compare(password, user.password);
    if (isComparePassword === false) {
      throw new UnauthorizedException('PASSWORD_ERROR'); // TODO - const err
    }
    return {
      token: await this.jwtService.signAsync({ id: user.id }),
    };
  }
}
