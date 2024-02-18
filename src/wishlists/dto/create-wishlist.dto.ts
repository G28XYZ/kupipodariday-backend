import { OmitType } from '@nestjs/swagger';
import { Wishlist } from '../entities/wishlist.entity';
import { IsOptional } from 'class-validator';

export class CreateWishlistDto extends OmitType(Wishlist, ['id']) {
  @IsOptional()
  itemsId?: number[];
}
