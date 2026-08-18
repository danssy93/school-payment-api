import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { AcademicSession } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AcademicSessionRepository extends BaseRepository<AcademicSession> {
  protected readonly logger = new Logger(AcademicSessionRepository.name);

  constructor(
    @InjectRepository(AcademicSession)
    readonly academicSessionRepository: Repository<AcademicSession>,
  ) {
    super(academicSessionRepository);
  }
}
