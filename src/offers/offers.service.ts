import { Inject, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { HandelLogger } from 'src/utils/handle-logger';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}
  /**
   * создать желающего скинуться на подарок
   * @param createOfferDto - данные желающего скинуться на подарок
   */
  @HandelLogger('OffersService')
  create(createOfferDto: CreateOfferDto & Pick<Offer, 'item' | 'user'>) {
    return this.offerRepository.save(createOfferDto);
  }
  /**
   * поиск желающего скинуться на подарок по уникальному идентификатору
   * @param id - уникальный идентификатор желающего скинуться на подарок
   */
  @HandelLogger('OffersService')
  findById(id: number) {
    return this.offerRepository.findBy({ id });
  }
  /**
   * поиск всех желающих скинуться на подарок
   */
  @HandelLogger('OffersService')
  findAll() {
    return this.offerRepository.find();
  }
}
