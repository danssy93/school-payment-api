import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { ClassArm } from './classArm.entity';
import { User } from './user.entity';
import { AcademicSession } from './session.entity';

export enum AssignmentType {
  TEACHER = 'teacher',
  BURSAR = 'bursar',
}

@Entity('staff_class_assignments')
@Index(['user_id', 'class_arm_id', 'assignment_type', 'session_id'], {
  unique: true,
})
export class AssignStaffToClass extends AbstractEntity {
  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  class_arm_id: string;

  @Column({ type: 'uuid' })
  session_id: string;

  @Column({ type: 'enum', enum: AssignmentType })
  assignment_type: AssignmentType;

  @Column({ type: 'uuid' })
  assigned_by: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ClassArm, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_arm_id' })
  class_arm: ClassArm;

  @ManyToOne(() => AcademicSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: AcademicSession;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'assigned_by' })
  assigned_by_user: User;

  toPayload(): Partial<AssignStaffToClass> {
    return {
      id: this.id,
      user_id: this.user_id,
      class_arm_id: this.class_arm_id,
      session_id: this.session_id,
      assignment_type: this.assignment_type,
      assigned_by: this.assigned_by,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    };
  }
}
