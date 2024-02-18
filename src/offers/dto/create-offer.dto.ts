import { PickType } from '@nestjs/swagger';
import { Offer } from '../entities/offer.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOfferDto extends PickType(Offer, [
  'amount',
  'hidden',
  'user',
  'item',
]) {
  @IsNumber()
  @IsNotEmpty()
  itemId: number;
}
