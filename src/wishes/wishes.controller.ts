import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { GetReqParam } from 'src/utils/get-req-param';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller('wishes')
export class WishesController {
  constructor(
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  create(
    @GetReqParam('user') user: User,
    @Body() createWishDto: CreateWishDto,
  ) {
    return this.wishesService.create({ ...createWishDto, owner: user });
  }

  @Post(':id/copy')
  async copyWish(
    @GetReqParam('user', 'id') userId: number,
    @Param('id', ParseIntPipe) wishId: number,
  ) {
    const wish = await this.wishesService.findCopingWish(userId, wishId);
    await this.usersService.copyWish(userId, wish);
    return wish;
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast40();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop20();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishesService.findOneById(id);
  }
}
