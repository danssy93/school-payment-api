import { Injectable, Logger } from '@nestjs/common';
import { ClassArm } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class ClassArmRepository extends BaseRepository<ClassArm> {
  protected readonly logger = new Logger(ClassArmRepository.name);

  constructor(
    @InjectRepository(ClassArm)
    readonly classArmRepository: Repository<ClassArm>,
  ) {
    super(classArmRepository);
  }
}
