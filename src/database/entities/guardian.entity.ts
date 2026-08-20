import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { GuardianRelationship } from '../enums';

@Entity('guardians')
export class Guardian extends AbstractEntity {
  @Column({ length: 100, type: 'varchar' })
  first_name: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  middle_name?: string;

  @Column({ length: 100, type: 'varchar' })
  last_name: string;

  @Column({ unique: true, length: 20, type: 'varchar' })
  phone_no: string;

  @Column({ unique: true, length: 20, type: 'varchar' })
  whatsapp_no: string;

  @Column({ unique: true, length: 100, type: 'varchar', nullable: true })
  email?: string;

  @Column({ length: 100, type: 'varchar' })
  occupation: string;

  @Column({ type: 'text' })
  home_address: string;

  @Column({ type: 'text' })
  work_address: string;

  @Column({
    type: 'enum',
    enum: GuardianRelationship,
  })
  relationship: GuardianRelationship;

  toPayload(): Partial<Guardian> {
    return {
      id: this.id,
      first_name: this.first_name,
      middle_name: this.middle_name,
      last_name: this.last_name,
      phone_no: this.phone_no,
      whatsapp_no: this.whatsapp_no,
      email: this.email,
      occupation: this.occupation,
      home_address: this.home_address,
      work_address: this.work_address,
      relationship: this.relationship,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    };
  }
}
