import { Module } from '@nestjs/common';
import { ClassController } from './controllers/class/class.controller';
import { ClassService } from './services/class/class.service';
import { ClassRepository } from 'src/database/repository/class.repository';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from 'src/database/database.module';
import { ClassArmRepository, UserRepository } from 'src/database/repository';

@Module({
  imports: [DatabaseModule.forFeature(), UserModule],
  controllers: [ClassController],
  providers: [
    ClassService,
    ClassRepository,
    ClassArmRepository,
    UserRepository,
  ],
})
export class ClassModule {}
