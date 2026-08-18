import { Injectable, Logger } from '@nestjs/common';
import { Class } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class ClassRepository extends BaseRepository<Class> {
  protected readonly logger = new Logger(ClassRepository.name);

  constructor(
    @InjectRepository(Class)
    readonly classRepository: Repository<Class>,
  ) {
    super(classRepository);
  }
}
