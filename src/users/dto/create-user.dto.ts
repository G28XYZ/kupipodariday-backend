import { MergeMixin } from 'src/utils/merge-mixin';
import { User } from '../entities/user.entity';
import { OmitType, PickType } from '@nestjs/swagger';

const requiredField = ['username', 'password', 'email'] as const;

export class CreateUserDto extends MergeMixin([
  PickType(User, requiredField),
  OmitType(User, [...requiredField, 'id', 'createdAt', 'updatedAt']),
]) {}

console.log(CreateUserDto.prototype);
