import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { User } from './user.entity';

@Entity('refresh_tokens')
export class RefreshToken extends AbstractEntity {
  user_id: string;

  @Column({ unique: true })
  token: string;

  @Column({ type: 'timestamp', precision: 6, nullable: true })
  expires_at: Date;

  @Column({ default: false })
  revoked: boolean;

  @ManyToOne(() => User, (user) => user.refresh_token, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
