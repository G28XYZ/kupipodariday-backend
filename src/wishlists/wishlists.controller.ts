import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UsersService } from 'src/users/users.service';
import { GetReqParam } from 'src/utils/get-req-param';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { ERROR_MESSAGES } from 'src/utils/constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller(['wishlistlists', 'wishlists'])
@UseGuards(JwtAuthGuard)
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
    const items: Wish[] = [];
    createWishlistDto.itemsId.map(async (id) =>
      items.push(await this.wishesService.findOneById(id)),
    );
    const wishlist = await this.wishlistsService.create({
      ...createWishlistDto,
      items,
    });
    await this.usersService.addWishlist(userId, wishlist);
    return wishlist;
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const wishlist = await this.wishlistsService.findOneById(id);
    if (!wishlist)
      throw new NotFoundException(ERROR_MESSAGES.WISHLIST.NOT_FOUND);
    return wishlist;
  }

  @Patch(':id')
  async updateWishlist(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.wishlistsService.findOneById(id);
    if (!wishlist)
      throw new NotFoundException(ERROR_MESSAGES.WISHLIST.NOT_FOUND);
    const newWishlist = {
      ...wishlist,
      ...updateWishlistDto,
    };
    await this.wishlistsService.update(id, newWishlist);
    return newWishlist;
  }

  @Delete(':id')
  async removeWishlist(@Param('id', ParseIntPipe) id: number) {
    const wishlist = await this.wishlistsService.findOneById(id);
    if (!wishlist)
      throw new NotFoundException(ERROR_MESSAGES.WISHLIST.NOT_FOUND);
    await this.wishlistsService.delete(id);
    return wishlist;
  }
}
