import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { AssignStaffToClass } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AssignStaffToClassRepository extends BaseRepository<AssignStaffToClass> {
  protected readonly logger = new Logger(AssignStaffToClassRepository.name);

  constructor(
    @InjectRepository(AssignStaffToClass)
    readonly assignStaffToClassRepository: Repository<AssignStaffToClass>,
  ) {
    super(assignStaffToClassRepository);
  }
}
