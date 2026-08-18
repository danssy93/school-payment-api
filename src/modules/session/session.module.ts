import { Module } from '@nestjs/common';
import { SessionService } from './services/session/session.service';
import { TermService } from './services/term/term.service';
import { SessionController } from './controllers/session/session.controller';
import { TermController } from './controllers/term/term.controller';
import {
  AcademicSessionRepository,
  TermRepository,
} from 'src/database/repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule.forFeature()],
  providers: [
    SessionService,
    TermService,
    AcademicSessionRepository,
    TermRepository,
  ],
  controllers: [SessionController, TermController],
})
export class SessionModule {}
