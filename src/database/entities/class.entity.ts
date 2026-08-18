import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { ClassCategory } from '../enums';
import { ClassArm } from './classArm.entity';

@Entity('classes')
export class Class extends AbstractEntity {
  @Column({ unique: true, length: 255, type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'enum', enum: ClassCategory })
  category: ClassCategory;

  @OneToMany(() => ClassArm, (arm) => arm.class)
  arms: ClassArm[];

  @Column({ default: true })
  is_active: boolean;

  toPayload(): Partial<Class> {
    return {
      id: this.id,
      name: this.name,
      level: this.level,
      category: this.category,
      arms: this.arms,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    };
  }
}
