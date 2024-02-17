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
  _findUserByQuerySearch(@Body() query: { query: string }) {
    return this.findUserByQuerySearch(query);
  }
}
