import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { FeeCategory } from './feeCategory.entity';
import { ClassArm } from './classArm.entity';
import { Class } from './class.entity';
import { AcademicSession } from './session.entity';
import { Term } from './term.entity';
import { User } from './user.entity';
import { FeeDiscount } from './feeDiscount.entity';

@Entity('fee_structures')
export class FeeStructure extends AbstractEntity {
  @Column({ type: 'uuid' })
  fee_category_id: string;

  @Column({ type: 'uuid', nullable: true })
  class_arm_id: string;

  @Column({ type: 'uuid' })
  class_id: string;

  @Column({ type: 'uuid' })
  term_id: string;

  @Column({ type: 'uuid' })
  session_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  due_date: Date;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'uuid' })
  created_by: string;

  @ManyToOne(() => FeeCategory, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'fee_category_id' })
  fee_category: FeeCategory;

  @ManyToOne(() => ClassArm, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'class_arm_id' })
  class_arm: ClassArm;

  @ManyToOne(() => Class, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => Term, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'term_id' })
  term: Term;

  @ManyToOne(() => AcademicSession, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'session_id' })
  session: AcademicSession;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => FeeDiscount, (fee_discount) => fee_discount.fee_structure)
  fee_discounts: FeeDiscount[];

  toPayload(): Partial<FeeStructure> {
    return {
      id: this.id,
      fee_category_id: this.fee_category_id,
      class_arm_id: this.class_arm_id,
      class_id: this.class_id,
      term_id: this.term_id,
      session_id: this.session_id,
      amount: this.amount,
      due_date: this.due_date,
      is_active: this.is_active,
      created_by: this.created_by,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    };
  }
}
