import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { BloodGroup, Gender, Genotype, StudentStatus } from '../enums';
import { User } from './user.entity';
import { Guardian } from './guardian.entity';

@Entity('students')
export class Student extends AbstractEntity {
  @Column({ unique: true, length: 50, type: 'varchar' })
  admission_no: string;

  @Column({ length: 100, type: 'varchar' })
  first_name: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  middle_name?: string;

  @Column({ length: 100, type: 'varchar' })
  last_name: string;

  @Column({ type: 'date' })
  date_of_birth: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({ nullable: true })
  profile_photo_url?: string;

  @Column({ type: 'uuid' })
  guardian_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  previous_school?: string;

  @Column({
    type: 'enum',
    enum: BloodGroup,
    nullable: true,
  })
  blood_group?: BloodGroup;

  @Column({
    type: 'enum',
    enum: Genotype,
    nullable: true,
  })
  genotype?: Genotype;

  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.ACTIVE,
  })
  student_status: StudentStatus;

  @Column({ type: 'uuid' })
  registered_by: User;

  @ManyToOne(() => Guardian, { nullable: false })
  @JoinColumn({ name: 'guardian_id' })
  guardian: Guardian;

  @ManyToOne(() => User, {
    nullable: false,
  })
  @JoinColumn({
    name: 'registered_by',
  })
  registered_by_user: User;

  toPayload(): Partial<Student> {
    return {
      id: this.id,
      admission_no: this.admission_no,
      first_name: this.first_name,
      middle_name: this.middle_name,
      last_name: this.last_name,
      date_of_birth: this.date_of_birth,
      gender: this.gender,
      profile_photo_url: this.profile_photo_url,
      guardian_id: this.guardian_id,
      previous_school: this.previous_school,
      blood_group: this.blood_group,
      genotype: this.genotype,
      student_status: this.student_status,
      registered_by: this.registered_by,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    };
  }
}
