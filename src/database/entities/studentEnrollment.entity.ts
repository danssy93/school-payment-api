import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Student } from './student.entity';
import { ClassArm } from './classArm.entity';
import { AcademicSession } from './session.entity';
import { Term } from './term.entity';
import { User } from './user.entity';
import { AbstractEntity } from './base.entity';

@Entity('student_enrollment')
export class StudentEnrollment extends AbstractEntity {
  @Column({ type: 'uuid' })
  student_id: string;

  @ManyToOne(() => Student, { nullable: false })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'uuid' })
  class_arm_id: string;

  @ManyToOne(() => ClassArm, { nullable: false })
  @JoinColumn({ name: 'class_arm_id' })
  class_arm: ClassArm;

  @Column({ type: 'uuid' })
  session_id: string;

  @ManyToOne(() => AcademicSession, { nullable: false })
  @JoinColumn({ name: 'session_id' })
  session: AcademicSession;

  @Column({ type: 'uuid', nullable: true })
  term_id?: string;

  @ManyToOne(() => Term, { nullable: true })
  @JoinColumn({ name: 'term_id' })
  term?: Term;

  @Column({
    type: 'uuid',
  })
  enrolled_by: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'enrolled_by' })
  enrolled_by_user: User;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP',
  })
  enrollment_date: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  toPayload(): Partial<StudentEnrollment> {
    return {
      id: this.id,
      student_id: this.student_id,
      class_arm_id: this.class_arm_id,
      session_id: this.session_id,
      term_id: this.term_id,
      enrolled_by: this.enrolled_by,
      enrollment_date: this.enrollment_date,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    };
  }
}
