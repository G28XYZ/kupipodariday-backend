import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { HandelLogger } from 'src/utils/handle-logger';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}
  /**
   * создать модель пользователя
   * @param user данные о пользователе
   */
  @HandelLogger('UsersService')
  private _genUser(user: Partial<User>) {
    return plainToInstance(User, user);
  }
  /**
   * создать пользователя
   * @param createUserDto данные о пользователе
   */
  @HandelLogger('UsersService')
  create(createUserDto: CreateUserDto): Promise<User> {
    return this.saveUser(createUserDto);
  }
  /**
   * поиск пользователей по введенному значению
   * @param searchText значение поиска
   */
  @HandelLogger('UsersService')
  findUsersByQuerySearch(searchText: string) {
    searchText = '%' + searchText + '%';
    return this.userRepository.find({
      where: [{ username: Like(searchText) }, { email: Like(searchText) }],
      order: { createdAt: 'ASC' },
    });
  }
  /**
   * сохранить изменения в данных о пользователе
   * @param user данные о пользователе
   */
  @HandelLogger('UsersService')
  saveUser(user: Partial<User>) {
    return this.userRepository.save(this._genUser(user));
  }
  /**
   * добавить коллекцию
   * @param userId уникальный идентификатор пользователя
   * @param wishlist данные о добавляемой коллекции
   */
  @HandelLogger('UsersService')
  async addWishlist(userId: number, wishlist: Wishlist) {
    const user = await this.findWishlists(userId);
    user.wishlists.push(wishlist);
    return this.userRepository.save(user);
  }
  /**
   * получить данные о пользователе с возможностью выбора столбцов
   * @param username юзернейм пользователя
   * @param select выбор столбцов которые необходимо получить
   */
  @HandelLogger('UsersService')
  findOneWithSelect(username: string, select: (keyof User)[] = []) {
    return this.userRepository.findOne({
      where: { username },
      select,
    });
  }
  /**
   * найти пользователя по уникальному идентификатору
   * @param id уникальный идентификатор пользователя
   */
  @HandelLogger('UsersService')
  findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }
  /**
   * поиск пользователя по юзернейму или почте
   * @param username юзернейм пользователя
   * @param email почти пользователя
   */
  @HandelLogger('UsersService')
  findByNameOrEmail(username?: string, email?: string) {
    return this.userRepository.findOne({ where: [{ username }, { email }] });
  }
  /**
   * поиск всех существующих пользователей
   */
  @HandelLogger('UsersService')
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  /**
   * обновление данных о пользователе
   * @param id уникальный идентификатор пользователя
   * @param updateUserDto обновляемые данные о пользователе
   */
  @HandelLogger('UsersService')
  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ id }, this._genUser(updateUserDto));
  }
  /**
   * поиск пользователя с доп столбцом - подарки (wishes)
   * @param id уникальный идентификатор пользователя
   */
  @HandelLogger('UsersService')
  findWishes(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['wishes'],
    });
  }
  /**
   * поиск пользователя с доп столбцом - коллекции (wishlists)
   * @param id уникальный идентификатор пользователя
   */
  @HandelLogger('UsersService')
  findWishlists(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['wishlists'],
    });
  }
}
