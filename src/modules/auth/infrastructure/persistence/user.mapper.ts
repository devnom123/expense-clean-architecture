import { User } from '../../domain/entities/user.entity';
import { UserEntity } from './entities/user.entity';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.password,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
