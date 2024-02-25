import {
  Controller,
  Post,
  Body,
  ConflictException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ERROR_MESSAGES, NAME_LOCAL_AUTH_GUARD } from 'src/utils/constants';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorator';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Public()
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

  @UseGuards(AuthGuard(NAME_LOCAL_AUTH_GUARD))
  @Public()
  @Post('signin')
  async signIn(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
