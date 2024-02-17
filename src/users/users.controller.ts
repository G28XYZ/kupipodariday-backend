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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './entities/user.entity';
import { GetReqParam } from 'src/utils/get-req-param';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@GetReqParam('user') user: User) {
    return user;
  }

  @Get('me/wishes')
  getWishes() {
    return [];
  }

  @Get('find')
  findUserByQuerySearch(@Query() { query }: { query: string }) {
    return this.usersService.findUsersByQuerySearch(query);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findByName(username);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
    return this.usersService.updateOne(id, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.removeOne(id);
  }

  @Post('find')
  _findUserByQuerySearch(@Body() query: { query: string }) {
    return this.findUserByQuerySearch(query);
  }
}
