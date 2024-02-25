import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from 'src/utils/constants';

/** декоратор для методов контроллера, отмечает метод как публичный */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
