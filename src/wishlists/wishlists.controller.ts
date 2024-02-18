import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';
import { GetReqParam } from 'src/utils/get-req-param';

@Controller(['wishlistlists', 'wishlists'])
export class WishlistsController {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(
    @GetReqParam('user', 'id') userId: number,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    const wishlist = await this.wishlistsService.create(createWishlistDto);
    await this.usersService.addWishlist(userId, wishlist);
    return wishlist;
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishlistsService.findOneById(id);
  }
}
