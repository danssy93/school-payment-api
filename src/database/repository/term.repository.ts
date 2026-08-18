import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { Term, User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TermRepository extends BaseRepository<Term> {
  protected readonly logger = new Logger(TermRepository.name);

  constructor(
    @InjectRepository(Term)
    readonly termRepository: Repository<Term>,
  ) {
    super(termRepository);
  }
}
