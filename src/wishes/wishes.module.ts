import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { OffersService } from 'src/offers/offers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, Offer, User])],
  controllers: [WishesController],
  providers: [WishesService, UsersService, OffersService],
  exports: [WishesService],
})
export class WishesModule {}
