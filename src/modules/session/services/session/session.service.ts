import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AcademicSession } from 'src/database/entities/session.entity';
import { AcademicSessionRepository } from 'src/database/repository';
import { CreateSessionDto, UpdateSessionDto } from '../../dtos';
import AppError from 'src/common/error/AppError';
import { AcademicSessionStatus } from 'src/database/enums/academicSession.enum';

@Injectable()
export class SessionService {
  protected readonly logger = new Logger(SessionService.name);

  constructor(private readonly sessionRepository: AcademicSessionRepository) {}

  async createSession(
    payload: CreateSessionDto,
    user_id: string,
  ): Promise<Partial<AcademicSession>> {
    const existingSession = await this.sessionRepository.findOne({
      name: payload.name,
    });
    if (existingSession) {
      throw new AppError(
        'Session with this name already exists',
        HttpStatus.CONFLICT,
      );
    }

    const newSession = await this.sessionRepository.create({
      ...payload,
      created_by: user_id,
    });
    return newSession.toPayload();
  }

  async getAllSessions(): Promise<Partial<AcademicSession>[]> {
    const sessions = await this.sessionRepository.findMany({
      relations: { terms: true },
      order: { created_at: 'DESC' },
    });
    return sessions.map((session) => session.toPayload());
  }

  async getActiveSession(): Promise<Partial<AcademicSession>> {
    const activeSession = await this.sessionRepository.findOne(
      {
        status: AcademicSessionStatus.ACTIVE,
      },
      { relations: { terms: true } },
    );

    if (!activeSession) {
      throw new AppError('No active session found', HttpStatus.NOT_FOUND);
    }
    return activeSession.toPayload();
  }

  async findSession(session_id: string): Promise<Partial<AcademicSession>> {
    const session = await this.sessionRepository.findOne(
      { id: session_id },
      { relations: { terms: true } },
    );

    if (!session) {
      throw new AppError('Session not found', HttpStatus.NOT_FOUND);
    }
    return session.toPayload();
  }

  async updateSession(
    session_id: string,
    payload: Partial<UpdateSessionDto>,
  ): Promise<Partial<AcademicSession>> {
    const existingSession = await this.sessionRepository.findOne({
      id: session_id,
    });

    if (!existingSession) {
      throw new AppError('Session not found', HttpStatus.NOT_FOUND);
    }

    if (existingSession.is_locked) {
      throw new AppError(
        'Session is locked and cannot be updated',
        HttpStatus.FORBIDDEN,
      );
    }

    const updateSession = await this.sessionRepository.update(
      { id: session_id },
      payload,
    );
    return updateSession.toPayload();
  }

  async activateSession(session_id: string): Promise<Partial<AcademicSession>> {
    const existingSession = await this.sessionRepository.findOne({
      id: session_id,
    });
    if (!existingSession) {
      throw new AppError('Session not found', HttpStatus.NOT_FOUND);
    }

    const currentActive = await this.sessionRepository.findOne({
      status: AcademicSessionStatus.ACTIVE,
    });

    if (currentActive && currentActive.id !== session_id) {
      currentActive.status = AcademicSessionStatus.INACTIVE;
      await this.sessionRepository.save(currentActive);
    }
    existingSession.status = AcademicSessionStatus.ACTIVE;
    const updatedSession = await this.sessionRepository.save(existingSession);
    return updatedSession.toPayload();
  }

  async lockSession(session_id: string): Promise<Partial<AcademicSession>> {
    const existingSession = await this.sessionRepository.findOne({
      id: session_id,
    });

    if (!existingSession) {
      throw new AppError('Session not found', HttpStatus.NOT_FOUND);
    }

    existingSession.is_locked = true;
    const updatedSession = await this.sessionRepository.save(existingSession);
    return updatedSession.toPayload();
  }

  async unlockSession(session_id): Promise<Partial<AcademicSession>> {
    const existingSession = await this.sessionRepository.findOne({
      id: session_id,
    });

    if (!existingSession) {
      throw new AppError('Session not found', HttpStatus.NOT_FOUND);
    }

    if (!existingSession.is_locked) {
      throw new AppError('Session is already unlocked', HttpStatus.BAD_REQUEST);
    }

    existingSession.is_locked = false;
    const updateSession = await this.sessionRepository.save(existingSession);
    return updateSession.toPayload();
  }

  async deactivateSession(
    session_id: string,
  ): Promise<Partial<AcademicSession>> {
    const existingSession = await this.sessionRepository.findOne({
      id: session_id,
    });

    if (!existingSession) {
      throw new AppError('Session not found', HttpStatus.NOT_FOUND);
    }

    if (existingSession.is_locked) {
      throw new AppError(
        'Session is locked and cannot be deactivated',
        HttpStatus.BAD_REQUEST,
      );
    }

    existingSession.status = AcademicSessionStatus.INACTIVE;
    const updatedSession = await this.sessionRepository.save(existingSession);
    return updatedSession.toPayload();
  }
}
