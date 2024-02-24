import {
  Controller,
  Post,
  Body,
  NotFoundException,
  Get,
  Param,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { GetReqParam } from 'src/utils/get-req-param';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { ERROR_MESSAGES } from 'src/utils/constants';

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly wishesService: WishesService,
  ) {}

  @Post()
  async create(
    @GetReqParam('user') user: User,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    const wishItem = await this.wishesService.findOneById(
      createOfferDto.itemId,
    );
    if (!wishItem) throw new NotFoundException(ERROR_MESSAGES.WISH.NOT_FOUND);
    if (wishItem.price <= parseInt(wishItem.raised?.toString(), 10))
      throw new BadRequestException(ERROR_MESSAGES.OFFER.IS_COMPLETE);
    if (
      createOfferDto.amount >
      wishItem.price - parseInt(wishItem.raised?.toString(), 10)
    )
      throw new BadRequestException(ERROR_MESSAGES.OFFER.MUCH_PRICE);

    await this.offersService.create({
      ...createOfferDto,
      user,
      item: wishItem,
    });

    wishItem.raised =
      (parseInt(wishItem.raised?.toString(), 10) || 0) + createOfferDto.amount;
    await this.wishesService.saveWish(wishItem);
    return {};
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.offersService.findById(id);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }
}
