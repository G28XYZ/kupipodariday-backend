import {
  Controller,
  Post,
  Body,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ERROR_MESSAGES } from 'src/utils/constants';
import { compare } from 'bcrypt';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.findByNameOrEmail(
      createUserDto.username,
      createUserDto.email,
    );
    if (user) {
      if (
        user.username === createUserDto.username ||
        user.email === createUserDto.email
      )
        throw new ConflictException(ERROR_MESSAGES.USER.EXISTS);
    }
    return this.authService.register(createUserDto);
  }

  @Post('signin')
  async signIn(@Body() { username, password }: LoginUserDto) {
    const user = await this.userService.findOneWithSelect(username, [
      'password',
      'id',
    ]);
    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER.NOT_FOUND);
    }
    const isComparePassword = await compare(password, user.password);
    if (isComparePassword === false) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER.NOT_CORRECT);
    }
    return this.authService.login(user.id);
  }
}
