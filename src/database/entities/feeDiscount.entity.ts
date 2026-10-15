import { ManyToOne, JoinColumn, Column, Entity } from 'typeorm';
import { DiscountReason, DiscountType } from '../enums/fees.enum';
import { AbstractEntity } from './base.entity';
import { FeeStructure } from './feeStructure.entity';
import { Student } from './student.entity';
import { User } from './user.entity';

@Entity('fee_discounts')
export class FeeDiscount extends AbstractEntity {
  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ type: 'uuid' })
  fee_structure_id: string;

  @Column({ type: 'enum', enum: DiscountType })
  discount_type: DiscountType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount_value: number;

  @Column({ type: 'enum', enum: DiscountReason })
  reason: DiscountReason;

  @Column({ type: 'uuid' })
  approved_by: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => Student, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(
    () => FeeStructure,
    (fee_structure) => fee_structure.fee_discounts,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'fee_structure_id' })
  fee_structure: FeeStructure;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approved_by_user: User;

  toPayload(): Partial<FeeDiscount> {
    return {
      id: this.id,
      student_id: this.student_id,
      fee_structure_id: this.fee_structure_id,
      discount_type: this.discount_type,
      discount_value: this.discount_value,
      reason: this.reason,
      approved_by: this.approved_by,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    };
  }
}
