import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { AbstractEntity } from './base.entity';

@Entity('fee_categories')
export class FeeCategory extends AbstractEntity {
  @Column({ unique: true, length: 255, type: 'varchar' })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ default: true })
  is_mandatory: boolean;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  toPayload(): Partial<FeeCategory> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      is_mandatory: this.is_mandatory,
      is_active: this.is_active,
      created_by: this.created_by,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    };
  }
}
