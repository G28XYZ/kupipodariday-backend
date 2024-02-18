import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './entities/user.entity';
import { GetReqParam } from 'src/utils/get-req-param';
import { WishesService } from 'src/wishes/wishes.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get('me')
  me(@GetReqParam('user') user: User) {
    return user;
  }

  @Get('me/wishes')
  async getUserWishes(@GetReqParam('user', 'id') id: number) {
    const user = await this.usersService.findWishes(id);
    if (user.wishes) {
      return user.wishes;
    }
    throw new NotFoundException('Подарки не найдены');
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
  findOne(@Param('username') username: string) {
    return this.usersService.findByName(username);
  }

  @Patch('me')
  async update(
    @GetReqParam('user', 'id') id: number,
    @Body() userData: UpdateUserDto,
  ) {
    if (!id?.toString()) throw new NotFoundException();
    return this.usersService.updateOne(id, userData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException();
    return this.usersService.removeOne(id);
  }

  @Post('find')
  _findUserByQuerySearch(@Body('query') query: string) {
    return this.findUserByQuerySearch(query);
  }
}
