import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import AppError from 'src/common/error/AppError';
import { Class, ClassArm, ClassArmType, User, UserType } from 'src/database/entities';
import { ClassRepository } from 'src/database/repository/class.repository';
import { ClassArmRepository } from 'src/database/repository/classArm.repository';
import { UserRepository } from 'src/database/repository/user.repository';
import { CreateClassArmDto, CreateClassDto } from '../../dtos/class.dto';
import { ArmName } from 'src/database/enums';

@Injectable()
export class ClassService {
  protected readonly logger = new Logger(ClassService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly classRepository: ClassRepository,
    private readonly classArmRepository: ClassArmRepository,
  ) {}

  async create(payload: CreateClassDto): Promise<Partial<Class>> {
    const existingClass = await this.classRepository.findOne({
      name: payload.name,
    });

    if (existingClass) {
      throw new AppError(
        'Class with this name already exists',
        HttpStatus.CONFLICT,
      );
    }

    const newClass = await this.classRepository.create(payload);

    return newClass.toPayload();
  }

  async addArm(
    classId: string,
    payload: CreateClassArmDto,
  ): Promise<Partial<ClassArm>> {
    const existingClass = await this.classRepository.findOne({
      id: classId,
    });

    if (!existingClass) {
      throw new AppError('Class not found', HttpStatus.NOT_FOUND);
    }

    const existingArms = await this.classArmRepository.find({
      class_id: classId,
    });

    if (existingArms.length >= 6) {
      throw new AppError(
        'Maximum of 6 arms allowed per class',
        HttpStatus.BAD_REQUEST,
      );
    }

    const duplicateArm = await this.classArmRepository.findOne({
      class_id: classId,
      name: payload.name,
    });
    if (duplicateArm) {
      throw new AppError(
        'This arm already exists in the class',
        HttpStatus.CONFLICT,
      );
    }

    const newClassArm = await this.classArmRepository.create({
      ...payload,
      class_id: existingClass.id,
      type:
        payload.name === ArmName.NEW_ADMISSION
          ? ClassArmType.NEW_ADMISSION
          : ClassArmType.REGULAR,
    });

    return newClassArm.toPayload();
  }

  async getAllClass(): Promise<Partial<Class>[]> {
    const classes = await this.classRepository.findMany({
      relations: { arms: true },
      order: { created_at: 'DESC' },
    });
    return classes.map((cls) => cls.toPayload());
  }

  async findClass(id: string): Promise<Partial<Class>> {
    const existingClass = await this.classRepository.findOne(
      {
        id,
      },
      { relations: { arms: true } },
    );

    if (!existingClass) {
      throw new AppError('Class not found', HttpStatus.NOT_FOUND);
    }

    return existingClass.toPayload();
  }

  async deactivateClass(id: string): Promise<Partial<Class>> {
    const existingClass = await this.classRepository.findOne({
      id,
    });

    if (!existingClass) {
      throw new AppError('Class not found', HttpStatus.NOT_FOUND);
    }

    existingClass.is_active = false;
    const updatedClass = await this.classRepository.save(existingClass);

    return updatedClass.toPayload();
  }

  async activateClass(id: string): Promise<Partial<Class>> {
    const existingClass = await this.classRepository.findOne({
      id,
    });

    if (!existingClass) {
      throw new AppError('Class not found', HttpStatus.NOT_FOUND);
    }

    existingClass.is_active = true;
    const updatedClass = await this.classRepository.save(existingClass);

    return updatedClass.toPayload();
  }

  // async assignTeacherToArm(
  //   class_id: string,
  //   arm_id: string,
  //   teacher_id: string,
  // ): Promise<Partial<ClassArm>> {
  //   const existingClassArm = await this.classArmRepository.findOne({
  //     id: arm_id,
  //     class_id: class_id,
  //   });

  //   if (!existingClassArm) {
  //     throw new AppError('Class arm not found', HttpStatus.NOT_FOUND);
  //   }

  //   const teacher = await this.userRepository.findOne({ id: teacher_id });

  //   if (!teacher) {
  //     throw new AppError('Teacher not found', HttpStatus.NOT_FOUND);
  //   }

  //   if (teacher.type !== UserType.TEACHER) {
  //     throw new AppError(
  //       'Only a teacher can be assigned as form teacher',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   existingClassArm.form_teacher_id = teacher_id;
  //   const updatedClassArm =
  //     await this.classArmRepository.save(existingClassArm);

  //   return updatedClassArm.toPayload();
  // }

  // async assignBursarToClass(
  //   class_id: string,
  //   arm_id: string,
  //   bursar_id: string,
  // ) {
  //   const existingClassArm = await this.classArmRepository.findOne({
  //     id: arm_id,
  //     class_id: class_id,
  //   });

  //   if (!existingClassArm) {
  //     throw new AppError('Class arm not found', HttpStatus.NOT_FOUND);
  //   }

  //   const bursar = await this.userRepository.findOne({ id: bursar_id });

  //   if (!bursar) {
  //     throw new AppError('Teacher not found', HttpStatus.NOT_FOUND);
  //   }

  //   existingClassArm.bursar_id = bursar_id;
  //   const updateClassArm = await this.classArmRepository.save(existingClassArm);
  //   return updateClassArm.toPayload();
  // }
}
