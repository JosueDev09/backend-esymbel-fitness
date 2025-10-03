import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../auth/enums/role.enum';

@Entity('tbUsers')
export class User {
  @PrimaryGeneratedColumn({ name: 'intId' })
  id: number;

  @Column({ name: 'strEmail', unique: true })
  email: string;

  @Column({ name: 'strPassword' })
  password: string;

  @Column({ name: 'strName' })
  name: string;

  @Column({
    name: 'strRoles',
    type: 'varchar',
    length: 500,
    default: Role.USER,
  })
  roles: Role[];

  @CreateDateColumn({ name: 'datCreatedAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'datUpdatedAt' })
  updatedAt: Date;
}
