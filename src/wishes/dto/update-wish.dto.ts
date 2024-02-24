import { Length, IsUrl, Min, IsOptional } from 'class-validator';
import { ERROR_MESSAGES } from 'src/utils/constants';
import { stringFormat } from 'src/utils/string-format';

export class UpdateWishDto {
  /** name — название подарка. Не может быть длиннее 250 символов и короче одного. */
  @Length(1, 250, {
    message: JSON.stringify({
      name: stringFormat(ERROR_MESSAGES.VALIDATION.TEXT_LENGTH, 1, 250),
    }),
  })
  @IsOptional()
  name: string;
  /** link — ссылка на интернет-магазин, в котором можно приобрести подарок, строка. */
  @IsUrl(undefined, {
    message: JSON.stringify({
      link: stringFormat(
        ERROR_MESSAGES.VALIDATION.IS_URL,
        'на интернет-магазин',
      ),
    }),
  })
  @IsOptional()
  link: string;
  /** image ссылка на изображение подарка, строка. Должна быть валидным URL. */
  @IsUrl(undefined, {
    message: JSON.stringify({
      image: stringFormat(ERROR_MESSAGES.VALIDATION.IS_URL, 'для картинки'),
    }),
  })
  @IsOptional()
  image: string;
  /** price — стоимость подарка, с округлением до сотых, число. */
  @Min(1, {
    message: JSON.stringify({
      price: stringFormat(ERROR_MESSAGES.VALIDATION.MIN_PRICE, 1),
    }),
  })
  @IsOptional()
  price: number;
  /** description — строка с описанием подарка длиной от 1 и до 1024 символов. */
  @Length(1, 1024, {
    message: JSON.stringify({
      description: stringFormat(ERROR_MESSAGES.VALIDATION.TEXT_LENGTH, 1, 1024),
    }),
  })
  @IsOptional()
  description: string;
}
