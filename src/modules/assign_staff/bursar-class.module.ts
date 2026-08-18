import { Module } from '@nestjs/common';
import { AssignStaffController } from './controllers/bursar-class/bursar-class.controller';
import { AssignStaffService } from './services/bursar-class/bursar-class.service';
import { DatabaseModule } from 'src/database/database.module';
import { AssignStaffToClassRepository } from 'src/database/repository/assignBursar.repository';
import {
  AcademicSessionRepository,
  ClassArmRepository,
  UserRepository,
} from 'src/database/repository';

@Module({
  imports: [DatabaseModule.forFeature()],
  controllers: [AssignStaffController],
  providers: [
    AssignStaffService,
    AssignStaffToClassRepository,
    UserRepository,
    AcademicSessionRepository,
    ClassArmRepository,
  ],
  exports: [AssignStaffService],
})
export class AssignStaffModule {}
