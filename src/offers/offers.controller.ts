import {
  Controller,
  Post,
  Body,
  NotFoundException,
  Get,
  Param,
  ParseIntPipe,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { GetReqParam } from 'src/utils/get-req-param';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { ERROR_MESSAGES } from 'src/utils/constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('offers')
@UseGuards(JwtAuthGuard)
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
    const wishItem = await this.wishesService.findOneWithOptions(
      createOfferDto.itemId,
      { relations: ['owner'] },
    );
    // не найден
    if (!wishItem) throw new NotFoundException(ERROR_MESSAGES.WISH.NOT_FOUND);
    // нельзя вносить деньги на свой подарок
    if (wishItem.owner.id === user.id)
      throw new BadRequestException(ERROR_MESSAGES.OFFER.SELF_OFFER);
    // деньги уже собраны
    if (wishItem.price <= parseInt(wishItem.raised?.toString(), 10))
      throw new BadRequestException(ERROR_MESSAGES.OFFER.IS_COMPLETE);
    // превышает стоимость
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
