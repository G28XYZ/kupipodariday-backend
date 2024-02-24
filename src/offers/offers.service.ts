import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}
  /**
   * создать желающего скинуться на подарок
   * @param createOfferDto - данные желающего скинуться на подарок
   */
  create(createOfferDto: CreateOfferDto & Pick<Offer, 'item' | 'user'>) {
    return this.offerRepository.save(createOfferDto);
  }
  /**
   * поиск желающего скинуться на подарок по уникальному идентификатору
   * @param id - уникальный идентификатор желающего скинуться на подарок
   */
  findById(id: number) {
    return this.offerRepository.findBy({ id });
  }
  /**
   * поиск всех желающих скинуться на подарок
   */
  findAll() {
    return this.offerRepository.find();
  }
}
