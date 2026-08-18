import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { Class } from './class.entity';
import { User } from './user.entity';
import { ArmName } from '../enums';

@Entity('class_arms')
export class ClassArm extends AbstractEntity {
  @Column({ type: 'uuid' })
  class_id: string;

  @Column({ type: 'enum', enum: ArmName })
  name: ArmName;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => Class, (cls) => cls.arms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'form_teacher_id' })
  form_teacher: User;

  toPayload(): Partial<ClassArm> {
    return {
      id: this.id,
      class_id: this.class_id,
      name: this.name,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
