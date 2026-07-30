import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AbstractEntity } from './base.entity';

export enum UserType {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  BURSAR = 'bursar',
  TEACHER = 'teacher',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface ICreateUser {
  full_name: string;
  user_name: string;
  phone: string;
  email?: string;
  password: string;
  type: UserType;
}

export interface ICurrentUser {
  id: string;
  user_name: string;
  phone: string;
  email: string;
  full_name: string;
  type: UserType;
  status: UserStatus;
}

@Entity('users')
export class User extends AbstractEntity {
  @Column({ length: 100, type: 'varchar' })
  full_name: string;

  @Column({ unique: true, length: 50, type: 'varchar' })
  user_name: string;

  @Column({ unique: true, length: 20, type: 'varchar' })
  phone: string;

  @Column({ unique: true, length: 100, type: 'varchar' })
  email: string;

  @Column({ length: 255, type: 'varchar' })
  password: string;

  @Column({ type: 'enum', enum: UserType })
  type: UserType;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'text', nullable: true })
  refresh_token?: string | null;

  @Column({ type: 'text', nullable: true })
  profile_picture?: string;

  @Column({ type: 'timestamp', nullable: true })
  last_login?: Date | null;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    if (this.phone) {
      this.phone = this.phone.replace('+', '');
    }
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }

  toPayload(): Partial<User> {
    return {
      id: this.id,
      full_name: this.full_name,
      user_name: this.user_name,
      phone: this.phone,
      email: this.email,
      type: this.type,
      status: this.status,
      profile_picture: this.profile_picture,
      created_at: this.created_at,
    };
  }
}
