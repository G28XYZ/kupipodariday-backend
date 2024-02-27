import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  NotFoundException,
  BadRequestException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { GetReqParam } from 'src/utils/get-req-param';
import { User } from 'src/users/entities/user.entity';
import { ERROR_MESSAGES } from 'src/utils/constants';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('wishes')
@UseGuards(JwtAuthGuard)
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(
    @GetReqParam('user') user: User,
    @Body() createWishDto: CreateWishDto,
  ) {
    this.wishesService.create({ ...createWishDto, owner: user });
    return {};
  }

  @Post(':id/copy')
  async copyWish(
    @GetReqParam('user') user: User,
    @Param('id', ParseIntPipe) wishId: number,
  ) {
    const wish = await this.wishesService.findOneWithOptions(wishId, {
      relations: ['owner'],
    });
    if (!wish.owner.id)
      throw new NotFoundException(ERROR_MESSAGES.WISH.NOT_FOUND);
    if (wish.owner.id === user.id)
      throw new BadRequestException(ERROR_MESSAGES.WISH.OWNER_COPY);
    await this.wishesService.copyWish(wish, user);
    return {};
  }

  @Public()
  @Get('last')
  findLast() {
    return this.wishesService.findLast40();
  }

  @Public()
  @Get('top')
  findTop() {
    return this.wishesService.findTop10();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishesService.findOneById(id);
  }

  @Patch(':id')
  async updateWish(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
    @GetReqParam('user', 'id') userId: number,
  ) {
    const wish = await this.wishesService.findOneWithOptions(id, {
      relations: ['offers', 'owner'],
    });
    if (wish.owner.id !== userId)
      throw new BadRequestException(ERROR_MESSAGES.WISH.EDIT_ANOTHER);
    if (wish.offers.length && updateWishDto.price?.toString())
      throw new BadRequestException(ERROR_MESSAGES.WISH.NOT_EDIT_PRICE);
    this.wishesService.updateById(id, updateWishDto);
    return {};
  }

  @Delete(':id')
  async removeWish(
    @Param('id', ParseIntPipe) id: number,
    @GetReqParam('user') user: User,
  ) {
    const wish = await this.wishesService.findOneWithOptions(id, {
      relations: ['owner', 'offers'],
    });
    if (!wish) throw new NotFoundException(ERROR_MESSAGES.WISH.NOT_FOUND);
    if (wish.owner.id !== user.id)
      throw new BadRequestException(ERROR_MESSAGES.WISH.DELETE_ANOTHER);
    if (wish.offers.length)
      throw new BadRequestException(ERROR_MESSAGES.WISH.HAS_OFFER);
    await this.wishesService.removeById(wish.id);
    return wish;
  }
}
