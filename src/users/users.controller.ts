import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  Post,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { GetReqParam } from 'src/utils/get-req-param';
import { ERROR_MESSAGES } from 'src/utils/constants';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@GetReqParam('user') user: User) {
    if (!user) throw new NotFoundException(ERROR_MESSAGES.AUTH.NOT_AUTH);
    return this.usersService.findById(user.id);
  }

  @Get(':username/wishes')
  async getUserWishes(
    @Param('username') name: string,
    @GetReqParam('user', 'id') id: number,
  ) {
    const userId =
      name === 'me' ? id : (await this.usersService.findByNameOrEmail(name)).id;
    const user = await this.usersService.findWishes(userId);
    if (user.wishes) {
      return user.wishes;
    }
    throw new NotFoundException(ERROR_MESSAGES.WISH.EMPTY);
  }

  @Get('find')
  findUserByQuerySearch(@Query('query') searchQuery: string) {
    return this.usersService.findUsersByQuerySearch(searchQuery);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findByNameOrEmail(username);
    if (!user) throw new BadRequestException(ERROR_MESSAGES.USER.NOT_FOUND);
    return user;
  }

  @Patch('me')
  async update(
    @GetReqParam('user') user: User,
    @Body() userData: UpdateUserDto,
  ) {
    if (!user) throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);

    const findUser = await this.usersService.findByNameOrEmail(
      userData.username,
      userData.email,
    );
    if (findUser.id !== user.id) {
      if (findUser.username === userData.username)
        throw new ConflictException(ERROR_MESSAGES.USER.EXISTS_NAME);

      if (findUser.email === userData.email)
        throw new ConflictException(ERROR_MESSAGES.USER.EXISTS_EMAIL);
    }

    return this.usersService.updateOne(user.id, userData);
  }

  @Post('find')
  _findUserByQuerySearch(@Body('query') query: string) {
    return this.findUserByQuerySearch(query);
  }
}
