import {
  Controller,
  Post,
  Body,
  UsePipes,
  HttpCode,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('signup')
  @HttpCode(201) // TODO - const
  async signUp(@Body() createUserDto: CreateUserDto) {
    if (await this.userService.findOne(createUserDto.username)) {
      throw new BadRequestException('Пользователь с таким именем существует'); // TODO - const
    }
    return this.authService.register(createUserDto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200) // TODO - const
  @Post('signin')
  async signIn(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }
}
