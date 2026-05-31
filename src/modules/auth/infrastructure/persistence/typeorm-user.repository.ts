import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserData,
  IUserRepository,
} from '../../application/ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { email: email.toLowerCase() },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async create(data: CreateUserData): Promise<User> {
    const entity = this.repository.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.passwordHash,
    });

    const saved = await this.repository.save(entity);
    return UserMapper.toDomain(saved);
  }
}
