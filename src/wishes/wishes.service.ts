import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { from, map } from 'rxjs';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
  ) {}

  private _genWish(wish: Partial<Wish>) {
    return plainToInstance(Wish, wish);
  }

  create(createWishDto: CreateWishDto) {
    return this.wishRepository.save(this._genWish(createWishDto));
  }

  findLast40() {
    return this.wishRepository.find({ take: 40 });
  }

  findTop20() {
    return this.wishRepository.find({ order: { copied: 'DESC' }, take: 20 });
  }

  findByUserId(id: number) {
    return this.wishRepository.find({
      where: { owner: { id } },
      relations: ['owner'],
    });
  }

  findOne(id: number, options?: FindOneOptions<Wish>) {
    return this.wishRepository.findOne({ where: { id }, ...options });
  }

  async findCopingWish(userId: number, wishId: number) {
    const wish = await this.findOne(wishId, { relations: ['owner'] });
    if (!wish.owner.id) throw new NotFoundException('Подарок не найден');
    if (wish.owner.id === userId)
      throw new BadRequestException('Нельзя скопировать свой подарок');
    return wish;
  }
}
