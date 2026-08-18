import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  AcademicSessionRepository,
  TermRepository,
} from 'src/database/repository';
import { CreateTermDto, UpdateTermDto } from '../../dtos';
import { Term } from 'src/database/entities';
import AppError from 'src/common/error/AppError';
import { TermStatus } from 'src/database/enums';

@Injectable()
export class TermService {
  protected readonly logger = new Logger(TermService.name);

  constructor(
    private readonly termRepository: TermRepository,
    private readonly sessionRepository: AcademicSessionRepository,
  ) {}

  async createTerm(
    session_id: string,
    payload: CreateTermDto,
  ): Promise<Partial<Term>> {
    const existingSession = await this.sessionRepository.findOne({
      id: session_id,
    });

    if (!existingSession) {
      throw new AppError('session not found', HttpStatus.NOT_FOUND);
    }

    if (existingSession.is_locked) {
      throw new AppError(
        'Cannot add term to a lock session',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingTerms = await this.termRepository.findMany({
      where: { session_id },
    });

    if (existingTerms.length >= 3) {
      throw new AppError(
        'A session can only have 3 term',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingTerm = await this.termRepository.findOne({
      session_id,
      name: payload.name,
    });
    if (existingTerm) {
      throw new AppError(
        `${payload.name} term already exists in this session`,
        HttpStatus.CONFLICT,
      );
    }

    const newTerm = await this.termRepository.create({
      ...payload,
      session_id: existingSession.id,
    });

    return newTerm.toPayload();
  }

  async getAllTerm(session_id: string): Promise<Partial<Term>[]> {
    const terms = await this.termRepository.findMany({
      where: { session_id: session_id },
      order: { start_date: 'ASC' },
    });
    return terms.map((terms) => terms.toPayload());
  }

  async updateTerm(
    session_id: string,
    term_id: string,
    payload: Partial<UpdateTermDto>,
  ): Promise<Partial<Term>> {
    const existingTerm = await this.termRepository.findOne({
      id: term_id,
      session_id,
    });

    if (!existingTerm) {
      throw new AppError('Term not found', HttpStatus.BAD_REQUEST);
    }

    const updateTerm = await this.termRepository.update(
      { id: term_id, session_id },
      payload,
    );

    return updateTerm.toPayload();
  }

  async activateTerm(
    session_id: string,
    term_id: string,
  ): Promise<Partial<Term>> {
    const existingTerm = await this.termRepository.findOne({
      id: term_id,
      session_id,
    });

    if (!existingTerm) {
      throw new AppError('Term not found', HttpStatus.NOT_FOUND);
    }

    const currentActive = await this.termRepository.findOne({
      status: TermStatus.ACTIVE,
      session_id: session_id,
    });

    if (currentActive && currentActive.id !== term_id) {
      currentActive.status = TermStatus.COMPLETED;
      await this.termRepository.save(currentActive);
    }

    existingTerm.status = TermStatus.ACTIVE;
    const updateTerm = await this.termRepository.save(existingTerm);
    return updateTerm.toPayload();
  }

  async deactivateTerm(
    session_id: string,
    term_id: string,
  ): Promise<Partial<Term>> {
    const existingTerm = await this.termRepository.findOne({
      id: term_id,
      session_id,
    });
    if (!existingTerm) {
      throw new AppError('Term not found', HttpStatus.NOT_FOUND);
    }

    existingTerm.status = TermStatus.COMPLETED;
    const updateTerm = await this.termRepository.save(existingTerm);
    return updateTerm.toPayload();
  }
}
