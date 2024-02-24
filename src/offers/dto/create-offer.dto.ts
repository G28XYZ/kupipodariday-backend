import { PickType } from '@nestjs/swagger';
import { Offer } from '../entities/offer.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ERROR_MESSAGES } from 'src/utils/constants';

export class CreateOfferDto extends PickType(Offer, ['amount', 'hidden']) {
  @IsNumber(undefined, {
    message: JSON.stringify({ itemId: ERROR_MESSAGES.VALIDATION.IS_NUMBER }),
  })
  @IsNotEmpty({
    message: JSON.stringify({ itemId: ERROR_MESSAGES.VALIDATION.NOT_EMPTY }),
  })
  itemId: number;
}
