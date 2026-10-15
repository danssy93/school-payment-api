import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { StudentEnrollment } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StudentEnrollmentRepository extends BaseRepository<StudentEnrollment> {
  protected readonly logger = new Logger(StudentEnrollmentRepository.name);

  constructor(
    @InjectRepository(StudentEnrollment)
    readonly studentEnrollmentRepository: Repository<StudentEnrollment>,
  ) {
    super(studentEnrollmentRepository);
  }
}
