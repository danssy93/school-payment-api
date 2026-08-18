import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClassModule } from './modules/class/class.module';
import { StudentModule } from './modules/student/student.module';
import { SessionModule } from './modules/session/session.module';
import { AssignStaffModule } from './modules/assign_staff/bursar-class.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    ClassModule,
    StudentModule,
    SessionModule,
    AssignStaffModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
