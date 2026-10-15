import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { Student } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StudentRepository extends BaseRepository<Student> {
  protected readonly logger = new Logger(StudentRepository.name);

  constructor(
    @InjectRepository(Student)
    readonly studentRepository: Repository<Student>,
  ) {
    super(studentRepository);
  }
}
