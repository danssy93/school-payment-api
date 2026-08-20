import { Column, Entity, Unique } from 'typeorm';

import { AbstractEntity } from './base.entity';

@Entity('admission_number_sequences')
@Unique('UQ_admission_prefix_year', ['prefix', 'year'])
export class AdmissionNumberSequence extends AbstractEntity {
  @Column({
    type: 'varchar',
    length: 20,
  })
  prefix: string;

  @Column({
    type: 'integer',
  })
  year: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  current_number: number;

  @Column({
    type: 'integer',
    default: 4,
  })
  padding: number;

  toPayload(): Partial<AdmissionNumberSequence> {
    return {
      id: this.id,
      prefix: this.prefix,
      year: this.year,
      current_number: this.current_number,
      padding: this.padding,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    };
  }
}
