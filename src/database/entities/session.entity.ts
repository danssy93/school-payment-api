import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { AcademicSessionStatus } from '../enums';
import { User } from './user.entity';
import { Term } from './term.entity';
import { StudentEnrollment } from './studentEnrollment.entity';

@Entity('academic_sessions')
export class AcademicSession extends AbstractEntity {
  @Column({ unique: true, length: 255, type: 'varchar' })
  name: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({
    type: 'enum',
    enum: AcademicSessionStatus,
    default: AcademicSessionStatus.UPCOMING,
  })
  status: AcademicSessionStatus;

  @Column({ type: 'boolean', default: false })
  is_locked: boolean;

  @Column({ type: 'uuid' })
  created_by: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => Term, (term) => term.session)
  terms: Term[];

  @OneToMany(() => StudentEnrollment, (enrollment) => enrollment.session)
  enrollments: StudentEnrollment[];

  toPayload(): Partial<AcademicSession> {
    return {
      id: this.id,
      name: this.name,
      start_date: this.start_date,
      end_date: this.end_date,
      status: this.status,
      created_by: this.created_by,
      creator: this.creator,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    };
  }
}
