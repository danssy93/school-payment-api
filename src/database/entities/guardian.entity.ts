import { Entity } from 'typeorm';
import { AbstractEntity } from './base.entity';

@Entity('guardians')
export class Guardian extends AbstractEntity {
  first_name: string;

  middle_name?: string;

  last_name: string;

  phone_number: string;

  email: string;

  address: string;

  relationship: string;

  Profession: string;

  home_address: string;

  office_address: string;
}
