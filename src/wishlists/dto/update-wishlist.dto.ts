import { Length, MaxLength, IsOptional, IsUrl } from 'class-validator';
import { ERROR_MESSAGES } from 'src/utils/constants';
import { stringFormat } from 'src/utils/string-format';

export class UpdateWishlistDto {
  /** name — название списка. Не может быть длиннее 250 символов и короче одного; */
  @Length(1, 250, {
    message: JSON.stringify({
      name: stringFormat(ERROR_MESSAGES.VALIDATION.TEXT_LENGTH, 1, 250),
    }),
  })
  @IsOptional()
  name: string;
  /** description — описание подборки, строка до 1500 символов; */
  @MaxLength(1500)
  @IsOptional()
  description: string;
  /** image — обложка для подборки; */
  @IsUrl(undefined, {
    message: JSON.stringify({
      image: stringFormat(ERROR_MESSAGES.VALIDATION.IS_URL, 'для картинки'),
    }),
  })
  @IsOptional()
  image: string;
}
