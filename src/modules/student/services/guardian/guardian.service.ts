import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { GuardianRepository } from 'src/database/repository/guardian.repository';
import { CreateGuardianDto, UpdateGuardianDto } from '../../dtos/guardian.dto';
import { Guardian } from 'src/database/entities';
import AppError from 'src/common/error/AppError';
import {
  FilterGuardianDto,
  PaginatedResult,
} from '../../dtos/pagination.dto';

@Injectable()
export class GuardianService {
  protected readonly logger = new Logger(GuardianService.name);

  constructor(private readonly guardianRepository: GuardianRepository) {}

  async createGuardian(payload: CreateGuardianDto): Promise<Partial<Guardian>> {
    const existingByPhone = await this.guardianRepository.findOne({
      phone_no: payload.phone_no,
    });

    if (existingByPhone) {
      throw new AppError(
        'Guardian with this phone number already exists',
        HttpStatus.CONFLICT,
      );
    }

    if (payload.email) {
      const existingByEmail = await this.guardianRepository.findOne({
        email: payload.email,
      });
      if (existingByEmail) {
        throw new AppError(
          'Guardian with this email already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    const newGuardian = await this.guardianRepository.create({
      ...payload,
    });
    return newGuardian.toPayload();
  }

  async getAllGuardians(
    filters: FilterGuardianDto,
  ): Promise<PaginatedResult<Partial<Guardian>>> {
    const { search, page = 1, limit = 20 } = filters;

    const query = this.guardianRepository
      .createQueryBuilder('guardian')
      .leftJoinAndSelect('guardian.students', 'students')
      .where('guardian.deleted_at IS NULL');

    if (search) {
      query.andWhere(
        '(guardian.first_name ILIKE :search OR guardian.last_name ILIKE :search OR guardian.phone_no ILIKE :search OR guardian.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const total = await query.getCount();
    const guardians = await query
      .orderBy('guardian.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data: guardians.map((guardian) => guardian.toPayload()),
      total,
      page,
      limit,
    };
  }

  async getGuardianById(guardian_id: string): Promise<Partial<Guardian>> {
    const guardian = await this.guardianRepository.findOne(
      {
        id: guardian_id,
      },
      { relations: { students: true } },
    );

    if (!guardian) {
      throw new AppError('Guardian not found', HttpStatus.NOT_FOUND);
    }
    return guardian.toPayload();
  }

  async updatedGuardians(
    guardian_id: string,
    payload: Partial<UpdateGuardianDto>,
  ): Promise<Partial<Guardian>> {
    const guardian = await this.guardianRepository.findOne({
      id: guardian_id,
    });

    if (!guardian) {
      throw new AppError('Guardian not found', HttpStatus.NOT_FOUND);
    }

    if (payload.phone_no && payload.phone_no !== guardian.phone_no) {
      const existingByPhone = await this.guardianRepository.findOne({
        phone_no: payload.phone_no,
      });
      if (existingByPhone) {
        throw new AppError(
          'Guardian with this phone number already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    if (payload.email && payload.email !== guardian.email) {
      const existingByEmail = await this.guardianRepository.findOne({
        email: payload.email,
      });
      if (existingByEmail) {
        throw new AppError(
          'Guardian with this email already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    const updatedGuardian = await this.guardianRepository.update(
      { id: guardian_id },
      payload,
    );
    return updatedGuardian.toPayload();
  }

  async deleteGuardian(guardian_id: string): Promise<void> {
    const guardian = await this.guardianRepository.findOne(
      { id: guardian_id },
      { relations: { students: true } },
    );

    if (!guardian) {
      throw new AppError('Guardian not found', HttpStatus.NOT_FOUND);
    }

    const activeStudents = (guardian.students || []).filter(
      (student) => !student.deleted_at,
    );

    if (activeStudents.length > 0) {
      throw new AppError(
        'Cannot delete guardian with linked students',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.guardianRepository.softDelete({ id: guardian_id });
  }
}
