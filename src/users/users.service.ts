import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(createUserDto);
  }

  findUsersByQuerySearch(searchText: string) {
    return this.userRepository
      .createQueryBuilder('User')
      .where('User.username like :name', { name: '%' + searchText + '%' })
      .orderBy('User.id', 'DESC')
      .getMany();
  }

  findOne(username: string, select: (keyof User)[] = []) {
    return this.userRepository.findOne({ where: { username }, select });
  }

  findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findByName(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  updateOne(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ id }, updateUserDto);
  }

  removeOne(id: number) {
    return this.userRepository.delete({ id });
  }
}
