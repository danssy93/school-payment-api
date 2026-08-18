import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TermName, TermStatus } from '../enums';
import { AbstractEntity } from './base.entity';
import { AcademicSession } from './session.entity';

@Entity('terms')
export class Term extends AbstractEntity {
  @Column({ type: 'uuid' })
  session_id: string;

  @Column({
    type: 'enum',
    enum: TermName,
    default: TermName.FIRST_TERM,
  })
  name: TermName;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({
    type: 'enum',
    enum: TermStatus,
    default: TermStatus.UPCOMING,
  })
  status: TermStatus;

  @ManyToOne(() => AcademicSession, (session) => session.terms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: AcademicSession;

  toPayload(): Partial<Term> {
    return {
      id: this.id,
      session_id: this.session_id,
      name: this.name,
      start_date: this.start_date,
      end_date: this.end_date,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    };
  }
}
