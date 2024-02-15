import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

/** Схема желающих скинуться (offer): */
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;
  /** user содержит id желающего скинуться; */
  @ManyToMany(() => User, (user) => user.offers)
  @JoinTable()
  user: User;

  /** item содержит ссылку на товар; */
  @OneToMany(() => Wish, (wish) => wish.name)
  item: string;

  /** amount — сумма заявки, округляется до двух знаков после запятой; */
  @Column()
  amount: number;

  /** hidden — флаг, который определяет показывать ли информацию о скидывающемся в списке. По умолчанию равен false. */
  @Column({ default: false })
  hidden: boolean;
}
