import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../../../infrastructure/persistence/entities/base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;
}
