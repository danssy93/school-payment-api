import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import AppError from 'src/common/error/AppError';
import {
  AssignmentType,
  AssignStaffToClass,
  UserType,
} from 'src/database/entities';
import {
  AcademicSessionRepository,
  AssignStaffToClassRepository,
  ClassArmRepository,
  UserRepository,
} from 'src/database/repository';

@Injectable()
export class AssignStaffService {
  protected readonly logger = new Logger(AssignStaffService.name);

  constructor(
    private readonly assignStaffToClass: AssignStaffToClassRepository,
    private readonly userRepository: UserRepository,
    private readonly classArmRepository: ClassArmRepository,
    private readonly academicSessionRepository: AcademicSessionRepository,
  ) {}

  async assignBursar(
    bursar_id: string,
    class_arm_id: string,
    session_id: string,
    assigned_by: string,
  ): Promise<Partial<AssignStaffToClass>> {
    const bursar = await this.userRepository.findOne({ id: bursar_id });
    if (!bursar) {
      throw new AppError('Bursar not found', HttpStatus.NOT_FOUND);
    }

    if (bursar.type !== UserType.BURSAR && bursar.type !== UserType.ADMIN) {
      throw new AppError('User is not a bursar staff', HttpStatus.BAD_REQUEST);
    }

    const classArm = await this.classArmRepository.findOne({
      id: class_arm_id,
    });

    if (!classArm) {
      throw new AppError('Class arm not found', HttpStatus.NOT_FOUND);
    }

    const session = await this.academicSessionRepository.findOne({
      id: session_id,
    });

    if (!session) {
      throw new AppError('Academic session not found', HttpStatus.NOT_FOUND);
    }

    const existingAssignment = await this.assignStaffToClass.findOne({
      user_id: bursar_id,
      class_arm_id,
      session_id,
      assignment_type: AssignmentType.BURSAR,
      is_active: true,
    });

    if (existingAssignment) {
      throw new AppError(
        'This bursar is already assigned to this class for this session',
        HttpStatus.CONFLICT,
      );
    }

    const assignment = await this.assignStaffToClass.create({
      user_id: bursar_id,
      class_arm_id,
      session_id,
      assignment_type: AssignmentType.BURSAR,
      assigned_by,
    });

    return assignment.toPayload();
  }

  async assignTeacher(
    teacher_id: string,
    class_arm_id: string,
    session_id: string,
    assigned_by: string,
  ): Promise<Partial<AssignStaffToClass>> {
    const teacher = await this.userRepository.findOne({ id: teacher_id });
    if (!teacher) {
      throw new AppError('Bursar not found', HttpStatus.NOT_FOUND);
    }

    if (teacher.type !== UserType.TEACHER) {
      throw new AppError('User is not a teacher', HttpStatus.BAD_REQUEST);
    }

    const classArm = await this.classArmRepository.findOne({
      id: class_arm_id,
    });

    if (!classArm) {
      throw new AppError('Class arm not found', HttpStatus.NOT_FOUND);
    }

    const session = await this.academicSessionRepository.findOne({
      id: session_id,
    });

    if (!session) {
      throw new AppError('Academic session not found', HttpStatus.NOT_FOUND);
    }

    const existingAssignment = await this.assignStaffToClass.findOne({
      user_id: teacher_id,
      assignment_type: AssignmentType.TEACHER,
      is_active: true,
    });

    if (existingAssignment) {
      await this.assignStaffToClass.update(
        {
          id: existingAssignment.id,
        },
        { is_active: false },
      );
    }

    const existingArmTeacher = await this.assignStaffToClass.findOne({
      class_arm_id,
      session_id,
      assignment_type: AssignmentType.TEACHER,
      is_active: true,
    });

    if (existingArmTeacher) {
      await this.assignStaffToClass.update(
        { id: existingArmTeacher.id },
        { is_active: false },
      );
    }

    const assignment = await this.assignStaffToClass.create({
      user_id: teacher_id,
      class_arm_id,
      session_id,
      assignment_type: AssignmentType.TEACHER,
      assigned_by,
    });

    return assignment.toPayload();
  }

  async getAllAssignments(): Promise<Partial<AssignStaffToClass>[]> {
    const assignments = await this.assignStaffToClass.findMany({
      where: { is_active: true },
      relations: { class_arm: true, session: true },
    });
    return assignments.map((a) => a.toPayload());
  }

  async getUserAssignments(
    user_id: string,
  ): Promise<Partial<AssignStaffToClass>> {
    const user = await this.assignStaffToClass.findOne(
      { id: user_id },
      { relations: { class_arm: true, session: true } },
    );
    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }

    return user.toPayload();
  }

  async removeAssignment(id: string): Promise<void> {
    const assignment = await this.assignStaffToClass.findOne({ id });
    if (!assignment) {
      throw new AppError('Assignment not found', HttpStatus.NOT_FOUND);
    }
    await this.assignStaffToClass.update({ id }, { is_active: false });
  }
}
