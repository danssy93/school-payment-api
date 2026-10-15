import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import {
  AcademicSessionRepository,
  ClassArmRepository,
  StudentEnrollmentRepository,
  StudentRepository,
} from 'src/database/repository';
import {
  BulkPromoteDto,
  EnrollStudentDto,
  PromoteStudentDto,
} from '../../dtos/enrollment.dto';
import { StudentEnrollment } from 'src/database/entities';
import AppError from 'src/common/error/AppError';
import { ArmName } from 'src/database/enums';

@Injectable()
export class EnrollmentService {
  protected readonly logger = new Logger(EnrollmentService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly enrollmentRepository: StudentEnrollmentRepository,
    private readonly studentRepository: StudentRepository,
    private readonly classArmRepository: ClassArmRepository,
    private readonly sessionRepository: AcademicSessionRepository,
  ) {}

  private async withTransaction<T>(
    work: (queryRunner: QueryRunner) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await work(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async enrollStudent(
    student_id: string,
    payload: EnrollStudentDto,
    user_id: string,
  ): Promise<Partial<StudentEnrollment>> {
    const existingStudent = await this.studentRepository.findOne({
      id: student_id,
    });

    if (!existingStudent) {
      throw new AppError('Student not found', HttpStatus.NOT_FOUND);
    }

    const existingSession = await this.sessionRepository.findOne({
      id: payload.session_id,
    });

    if (!existingSession) {
      throw new AppError('Session not found', HttpStatus.NOT_FOUND);
    }

    const existingClassArm = await this.classArmRepository.findOne({
      id: payload.class_arm_id,
    });
    if (!existingClassArm) {
      throw new AppError('Class arm not found', HttpStatus.NOT_FOUND);
    }

    const existingEnrollment = await this.enrollmentRepository.findOne({
      student_id,
      session_id: payload.session_id,
      is_active: true,
    });

    if (existingEnrollment) {
      throw new AppError(
        'Student is already enrolled in this session',
        HttpStatus.CONFLICT,
      );
    }

    const enrollment = await this.enrollmentRepository.create({
      student_id,
      class_arm_id: payload.class_arm_id,
      session_id: payload.session_id,
      term_id: payload.term_id,
      enrolled_by: user_id,
    });

    return enrollment.toPayload();
  }

  async classifyStudent(
    student_id: string,
    class_arm_id: string,
    user_id: string,
  ): Promise<Partial<StudentEnrollment>> {
    const existingStudent = await this.studentRepository.findOne({
      id: student_id,
    });
    if (!existingStudent) {
      throw new AppError('Student not found', HttpStatus.NOT_FOUND);
    }

    const classArm = await this.classArmRepository.findOne({
      id: class_arm_id,
    });
    if (!classArm) {
      throw new AppError('Class arm not found', HttpStatus.NOT_FOUND);
    }

    if (classArm.name === ArmName.NEW_ADMISSION) {
      throw new AppError(
        'Cannot classify student into new admission arm',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentEnrollment = await this.enrollmentRepository.findOne(
      {
        student_id,
        is_active: true,
      },
      { relations: { class_arm: true } },
    );

    if (!currentEnrollment) {
      throw new AppError(
        'Student have no active enrollment',
        HttpStatus.NOT_FOUND,
      );
    }

    if (currentEnrollment.class_arm.name !== ArmName.NEW_ADMISSION) {
      throw new AppError(
        'Student is already classified into a class arm',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updated = await this.enrollmentRepository.update(
      { id: currentEnrollment.id },
      { class_arm_id, enrolled_by: user_id },
    );
    return updated.toPayload();
  }

  async changeArm(
    student_id: string,
    class_arm_id: string,
    user_id: string,
  ): Promise<Partial<StudentEnrollment>> {
    const existingStudent = await this.studentRepository.findOne({
      id: student_id,
    });
    if (!existingStudent) {
      throw new AppError('Student not found', HttpStatus.NOT_FOUND);
    }

    const classArm = await this.classArmRepository.findOne({
      id: class_arm_id,
    });
    if (!classArm) {
      throw new AppError('Class arm is not found', HttpStatus.NOT_FOUND);
    }

    if (classArm.name === ArmName.NEW_ADMISSION) {
      throw new AppError(
        'Cannot move student to new admission arm',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentEnrollment = await this.enrollmentRepository.findOne({
      student_id,
      is_active: true,
    });
    if (!currentEnrollment) {
      throw new AppError(
        'Student has no active enrollment',
        HttpStatus.NOT_FOUND,
      );
    }

    if (currentEnrollment.class_arm_id === class_arm_id) {
      throw new AppError(
        'Student is already in this class arm',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updated = await this.enrollmentRepository.update(
      { id: currentEnrollment.id },
      { class_arm_id, enrolled_by: user_id },
    );

    return updated.toPayload();
  }

  async promoteStudent(
    student_id: string,
    payload: PromoteStudentDto,
    user_id: string,
  ): Promise<Partial<StudentEnrollment>> {
    const existingStudent = await this.studentRepository.findOne({
      id: student_id,
    });
    if (!existingStudent) {
      throw new AppError('Student not found', HttpStatus.NOT_FOUND);
    }

    const newSession = await this.sessionRepository.findOne({
      id: payload.session_id,
    });
    if (!newSession) {
      throw new AppError('Session not found', HttpStatus.NOT_FOUND);
    }

    const newClassArm = await this.classArmRepository.findOne({
      id: payload.class_arm_id,
    });
    if (!newClassArm) {
      throw new AppError('Class arm not found', HttpStatus.NOT_FOUND);
    }

    if (newClassArm.name === ArmName.NEW_ADMISSION) {
      throw new AppError(
        'Cannot promote student to new admission arm',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentEnrollment = await this.enrollmentRepository.findOne({
      student_id,
      is_active: true,
    });

    if (!currentEnrollment) {
      throw new AppError(
        'Student has no active enrollment',
        HttpStatus.NOT_FOUND,
      );
    }

    const existingNewEnrollment = await this.enrollmentRepository.findOne({
      student_id,
      session_id: payload.session_id,
      is_active: true,
    });

    if (existingNewEnrollment) {
      throw new AppError(
        'Student is already enrolled in the new session',
        HttpStatus.CONFLICT,
      );
    }

    return this.withTransaction(async (queryRunner) => {
      await this.enrollmentRepository.update(
        { id: currentEnrollment.id },
        { is_active: false },
        queryRunner,
      );

      const newEnrollment = await this.enrollmentRepository.create(
        {
          student_id,
          session_id: payload.session_id,
          class_arm_id: payload.class_arm_id,
          term_id: payload.term_id,
          enrolled_by: user_id,
          is_active: true,
        },
        queryRunner,
      );

      return newEnrollment.toPayload();
    });
  }

  async bulkPromote(
    current_arm_id: string,
    payload: BulkPromoteDto,
    user_id: string,
  ): Promise<{ success: number; failed: number; errors: any[] }> {
    const nextArm = await this.classArmRepository.findOne({
      id: payload.next_class_arm_id,
    });
    if (!nextArm) {
      throw new AppError('Next class arm not found', HttpStatus.NOT_FOUND);
    }

    if (nextArm.name === ArmName.NEW_ADMISSION) {
      throw new AppError(
        'Cannot promote students to new admission arm',
        HttpStatus.BAD_REQUEST,
      );
    }

    const session = await this.sessionRepository.findOne({
      id: payload.session_id,
    });
    if (!session) {
      throw new AppError('Session not found', HttpStatus.NOT_FOUND);
    }

    const enrollments = await this.enrollmentRepository.findMany({
      where: { class_arm_id: current_arm_id, is_active: true },
    });
    if (enrollments.length === 0) {
      throw new AppError(
        'No active enrollments found for the current class arm',
        HttpStatus.NOT_FOUND,
      );
    }

    let success = 0;
    let failed = 0;
    const errors: any[] = [];

    for (const enrollment of enrollments) {
      try {
        await this.promoteStudent(
          enrollment.student_id,
          {
            class_arm_id: payload.next_class_arm_id,
            session_id: payload.session_id,
            term_id: payload.term_id,
          },
          user_id,
        );
        success++;
      } catch (error) {
        failed++;
        errors.push({
          student_id: enrollment.student_id,
          reason: error.message || 'Unknown error',
        });
      }
    }
    return { success, failed, errors };
  }

  async repeatClass(
    student_id: string,
    payload: PromoteStudentDto,
    user_id: string,
  ): Promise<Partial<StudentEnrollment>> {
    const student = await this.studentRepository.findOne({ id: student_id });
    if (!student) {
      throw new AppError('Student not found', HttpStatus.NOT_FOUND);
    }

    const session = await this.sessionRepository.findOne({
      id: payload.session_id,
    });
    if (!session) {
      throw new AppError('Session not found', HttpStatus.NOT_FOUND);
    }

    const classArm = await this.classArmRepository.findOne({
      id: payload.class_arm_id,
    });
    if (!classArm) {
      throw new AppError('Class arm not found', HttpStatus.NOT_FOUND);
    }

    const currentEnrollment = await this.enrollmentRepository.findOne({
      student_id,
      is_active: true,
    });
    if (!currentEnrollment) {
      throw new AppError(
        'Student has no active enrollment',
        HttpStatus.NOT_FOUND,
      );
    }

    const existingEnrollment = await this.enrollmentRepository.findOne({
      student_id,
      session_id: payload.session_id,
      is_active: true,
    });

    if (existingEnrollment) {
      throw new AppError(
        'Student is already enrolled in the new session',
        HttpStatus.CONFLICT,
      );
    }

    return this.withTransaction(async (queryRunner) => {
      await this.enrollmentRepository.update(
        { id: currentEnrollment.id },
        { is_active: false },
        queryRunner,
      );

      const newEnrollment = await this.enrollmentRepository.create(
        {
          student_id,
          class_arm_id: payload.class_arm_id,
          session_id: payload.session_id,
          term_id: payload.term_id,
          enrolled_by: user_id,
          is_active: true,
        },
        queryRunner,
      );
      return newEnrollment.toPayload();
    });
  }

  async getEnrollmentHistory(
    student_id: string,
  ): Promise<Partial<StudentEnrollment>[]> {
    const student = await this.studentRepository.findOne({ id: student_id });
    if (!student) {
      throw new AppError('Student not found', HttpStatus.NOT_FOUND);
    }

    const enrollments = await this.enrollmentRepository.findMany({
      where: { student_id },
      relations: {
        class_arm: { class: true },
        session: true,
        term: true,
      },
      order: { created_at: 'DESC' },
    });
    return enrollments.map((enrollment) => enrollment.toPayload());
  }
}
