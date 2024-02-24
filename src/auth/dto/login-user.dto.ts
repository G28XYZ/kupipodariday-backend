import { IsNotEmpty } from 'class-validator';
import { ERROR_MESSAGES } from 'src/utils/constants';

export class LoginUserDto {
  @IsNotEmpty({ message: ERROR_MESSAGES.VALIDATION.NOT_EMPTY })
  username: string;

  @IsNotEmpty({ message: ERROR_MESSAGES.VALIDATION.NOT_EMPTY })
  password: string;
}
