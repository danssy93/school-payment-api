import { Module } from '@nestjs/common';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { UserRepository } from 'src/database/repository/user.repository';
import { DatabaseModule } from 'src/database/database.module';
import { AssignStaffToClassRepository } from 'src/database/repository';

@Module({
  imports: [DatabaseModule.forFeature()],
  controllers: [UserController],
  providers: [UserService, UserRepository, AssignStaffToClassRepository],
  exports: [UserService],
})
export class UserModule {}
