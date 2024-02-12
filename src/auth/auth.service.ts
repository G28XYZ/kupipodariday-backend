import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { compare, genSalt, hash } from 'bcrypt';
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

  async register({ password, ...createUserDto }: CreateUserDto) {
    const user = await this.userService.create({
      ...createUserDto,
      password: await hash(password, await genSalt(10)), // TODO - constants salt
    });
    return this.generateToken(user.id);
  }

  async generateToken(userId: number) {
    return {
      token: await this.jwtService.signAsync(
        { id: userId },
        { secret: this.configService.get('jwtSecret') },
      ),
    };
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
    return this.generateToken(user.id);
  }
}
