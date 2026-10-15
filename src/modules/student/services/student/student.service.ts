import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import AppError from 'src/common/error/AppError';
import { Student } from 'src/database/entities';
import {
  AcademicSessionRepository,
  AdmissionNumberSequenceRepository,
  ClassArmRepository,
  ClassRepository,
  GuardianRepository,
  StudentEnrollmentRepository,
  StudentRepository,
} from 'src/database/repository';
import {
  BulkUploadStudentDto,
  ChangeStudentStatusDto,
  CreateStudentDto,
  UpdateStudentDto,
} from '../../dtos/student.dto';
import { ArmName, StudentStatus } from 'src/database/enums';
import { FilterStudentDto } from '../../dtos/pagination.dto';

@Injectable()
export class StudentService {
  protected readonly logger = new Logger(StudentService.name);

  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly guardianRepository: GuardianRepository,
    private readonly admissionNumberRepo: AdmissionNumberSequenceRepository,
    private readonly enrollmentRepository: StudentEnrollmentRepository,
    private readonly classArmRepository: ClassArmRepository,
    private readonly classRepository: ClassRepository,
    private readonly sessionRepository: AcademicSessionRepository,
  ) {}

  async generateAdmissionNumber(): Promise<string> {
    const prefix = 'GKA';
    const year = new Date().getFullYear();

    let sequence = await this.admissionNumberRepo.findOne({
      prefix,
      year,
    });

    if (!sequence) {
      sequence = await this.admissionNumberRepo.create({
        prefix,
        year,
        current_number: 0,
        padding: 4,
      });
    }

    // Increment the sequence
    sequence.current_number += 1;
    await this.admissionNumberRepo.save(sequence);

    // Format: GKA/2024/0001
    const paddedNumber = String(sequence.current_number).padStart(
      sequence.padding,
      '0',
    );

    return `${prefix}/${year}/${paddedNumber}`;
  }

  async registerStudent(
    payload: CreateStudentDto,
    user_id: string,
  ): Promise<Partial<Student>> {
    const guardian = await this.guardianRepository.findOne({
      id: payload.guardian_id,
    });

    if (!guardian) {
      throw new AppError('Guardian not found', HttpStatus.NOT_FOUND);
    }

    const classArm = await this.classArmRepository.findOne({
      id: payload.class_arm_id,
    });
    if (!classArm) {
      throw new AppError('Class arm not found', HttpStatus.NOT_FOUND);
    }

    if (classArm.name !== ArmName.NEW_ADMISSION) {
      throw new AppError(
        'Students can only be admitted into a new_admission arm',
        HttpStatus.BAD_REQUEST,
      );
    }

    const session = await this.sessionRepository.findOne({
      id: payload.session_id,
    });

    if (!session) {
      throw new AppError('Session not found', HttpStatus.NOT_FOUND);
    }

    const existingStudent = await this.studentRepository.findOne({
      first_name: payload.first_name,
      last_name: payload.last_name,
      date_of_birth: payload.date_of_birth,
      guardian_id: payload.guardian_id,
    });

    if (existingStudent) {
      throw new AppError(
        'Student with the same name, date of birth and guardian already exist',
        HttpStatus.CONFLICT,
      );
    }

    const admission_no = await this.generateAdmissionNumber();

    const newStudent = await this.studentRepository.create({
      ...payload,
      admission_no,
      registered_by: user_id,
    });

    await this.enrollmentRepository.create({
      student_id: newStudent.id,
      class_arm_id: payload.class_arm_id,
      session_id: payload.session_id,
      is_active: true,
    });

    const studentWithEnrollment = await this.studentRepository.findOne(
      { id: newStudent.id },
      {
        relations: {
          guardian: true,
          enrollments: { class_arm: { class: true } },
        },
      },
    );
    return studentWithEnrollment!.toPayload();
  }

  async getAllStudents(filters: FilterStudentDto): Promise<{
    data: Partial<Student>[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      status,
      session_id,
      class_arm_id,
      guardian_id,
      gender,
      search,
      page = 1,
      limit = 20,
    } = filters;

    const query = this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.guardian', 'guardian')
      .leftJoinAndSelect('student.enrollments', 'enrollment')
      .leftJoinAndSelect('enrollment.class_arm', 'classs_arm')
      .leftJoinAndSelect('enrollment.session', 'session')
      .where('student.deleted_at IS NULL');

    if (status) {
      query.andWhere('student.student_status = :status', { status });
    }

    if (gender) {
      query.andWhere('student.gender = :gender', { gender });
    }

    if (guardian_id) {
      query.andWhere('student.guardian_id = :guardian_id', { guardian_id });
    }

    if (session_id) {
      query.andWhere('enrollment.session_id = :session_id', { session_id });
      query.andWhere('enrollment.is_active = true');
    }

    if (class_arm_id) {
      query.andWhere('enrollment.class_arm_id = :class_arm_id', {
        class_arm_id,
      });
      query.andWhere('enrollment.is_active = true');
    }

    if (search) {
      query.andWhere(
        '(student.first_name ILIKE :search OR student.last_name ILIKE :search OR student.admission_no ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const total = await query.getCount();
    const data = await query
      .orderBy('student.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data: data.map((student) => student.toPayload()),
      total,
      page,
      limit,
    };
  }

  async findStudent(student_id: string): Promise<Partial<Student>> {
    const student = await this.studentRepository.findOne(
      {
        id: student_id,
      },
      { relations: { guardian: true, enrollments: true } },
    );

    if (!student) {
      throw new AppError('Student does not exist', HttpStatus.NOT_FOUND);
    }

    return student.toPayload();
  }

  async updateStudent(
    student_id: string,
    payload: UpdateStudentDto,
  ): Promise<Partial<Student>> {
    const existingStudent = await this.studentRepository.findOne({
      id: student_id,
    });

    if (!existingStudent) {
      throw new AppError('student does not exist', HttpStatus.NOT_FOUND);
    }

    const updateStudent = await this.studentRepository.update(
      { id: student_id },
      payload,
    );
    return updateStudent.toPayload();
  }

  async deleteStudent(student_id: string): Promise<void> {
    const existingStudent = await this.studentRepository.findOne({
      id: student_id,
    });
    if (!existingStudent) {
      throw new AppError('student does not exist', HttpStatus.NOT_FOUND);
    }
    await this.studentRepository.softDelete({
      id: student_id,
    });

    await this.enrollmentRepository.softDelete({ student_id: student_id });
    return;
  }

  async changeStatus(
    student_id: string,
    payload: ChangeStudentStatusDto,
  ): Promise<Partial<Student>> {
    const existingStudent = await this.studentRepository.findOne({
      id: student_id,
    });

    if (!existingStudent) {
      throw new AppError('student does not exist', HttpStatus.NOT_FOUND);
    }

    if (existingStudent.student_status === StudentStatus.ALUMNI) {
      throw new AppError(
        'Cannot change status of an alumni student',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.student_status === StudentStatus.GRADUATED) {
      payload.student_status = StudentStatus.ALUMNI;
    }

    const updateStatus = await this.studentRepository.update(
      {
        id: student_id,
      },
      { student_status: payload.student_status },
    );
    return updateStatus.toPayload();
  }

  async getStudentsByArm(arm_id: string): Promise<Partial<Student>[]> {
    const enrollments = await this.enrollmentRepository.findMany({
      where: { class_arm_id: arm_id, is_active: true },
      relations: { student: { guardian: true } },
    });

    return enrollments.map((enrollment) => enrollment.student.toPayload());
  }

  async getUnclassifiedStudents(): Promise<Partial<Student>[]> {
    const enrollments = await this.enrollmentRepository.findMany({
      where: {
        is_active: true,
        class_arm: { name: ArmName.NEW_ADMISSION },
      },
      relations: { student: { guardian: true }, class_arm: true },
    });
    return enrollments.map((enrollment) => enrollment.student.toPayload());
  }

  async bulkUploadStudents(
    rows: BulkUploadStudentDto[],
    user_id: string,
  ): Promise<{ success: number; failed: number; errors: any[] }> {
    let success = 0;
    let failed = 0;
    const errors: any[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      try {
        let guardian = await this.guardianRepository.findOne({
          phone_no: row.guardian_phone,
        });

        if (!guardian) {
          const nameParts = row.guardian_name.trim().split(' ');
          const first_name = nameParts[0];
          const last_name = nameParts.slice(1).join('') || first_name;

          guardian = await this.guardianRepository.create({
            first_name,
            last_name,
            phone_no: row.guardian_phone,
            email: row.guardian_email,
            relationship: row.guardian_relationship,
            occupation: 'Not provided',
            home_address: 'Not provided',
          });
        }

        const existing = await this.studentRepository.findOne({
          first_name: row.first_name,
          last_name: row.last_name,
          date_of_birth: row.date_of_birth,
          guardian_id: guardian.id,
        });

        if (existing) {
          failed++;
          errors.push({
            row: i + 2,
            reason: 'Student with same name, DOB and guardian already exist',
          });
          continue;
        }

        const admission_no = await this.generateAdmissionNumber();

        await this.studentRepository.create({
          first_name: row.first_name,
          middle_name: row.middle_name,
          last_name: row.last_name,
          date_of_birth: row.date_of_birth,
          gender: row.gender,
          blood_group: row.blood_group,
          genotype: row.genotype,
          health_notes: row.health_notes,
          previous_school: row.previous_school,
          guardian_id: guardian.id,
          admission_no,
          registered_by: user_id,
        });

        success++;
      } catch (error) {
        failed++;
        errors.push({
          row: i + 2,
          reason: error.message || 'Unknown error',
        });
      }
    }
    return { success, failed, errors };
  }

  async restoreStudent(student_id: string): Promise<void> {
    const existingStudent = await this.studentRepository.findOne(
      {
        id: student_id,
      },
      { withDeleted: true },
    );

    if (!existingStudent) {
      throw new AppError('student does not exist', HttpStatus.NOT_FOUND);
    }

    if (!existingStudent.deleted_at) {
      throw new AppError('student is not deleted', HttpStatus.BAD_REQUEST);
    }

    await this.studentRepository.restore({ id: student_id });
    await this.enrollmentRepository.restore({ student_id: student_id });
    return;
  }
}
