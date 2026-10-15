import { Module } from '@nestjs/common';
import { StudentController } from './controllers/student/student.controller';
import { GuardianController } from './controllers/guardian/guardian.controller';
import { EnrollmentController } from './controllers/enrollment/enrollment.controller';
import { EnrollmentService } from './services/enrollment/enrollment.service';
import { GuardianService } from './services/guardian/guardian.service';
import {
  AcademicSessionRepository,
  AdmissionNumberSequenceRepository,
  ClassArmRepository,
  ClassRepository,
  GuardianRepository,
  StudentEnrollmentRepository,
  StudentRepository,
} from 'src/database/repository';
import { DatabaseModule } from 'src/database/database.module';
import { StudentService } from './services/student/student.service';

@Module({
  imports: [DatabaseModule.forFeature()],
  controllers: [StudentController, GuardianController, EnrollmentController],
  providers: [
    EnrollmentService,
    StudentService,
    GuardianService,
    StudentRepository,
    GuardianRepository,
    StudentEnrollmentRepository,
    AdmissionNumberSequenceRepository,
    ClassRepository,
    ClassArmRepository,
    AcademicSessionRepository,
  ],
})
export class StudentModule {}
