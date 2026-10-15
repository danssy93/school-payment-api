import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentService } from '../../services/enrollment/enrollment.service';
import {
  BulkPromoteDto,
  ClassifyStudentDto,
  EnrollStudentDto,
  PromoteStudentDto,
} from '../../dtos/enrollment.dto';
import { CurrentUser } from 'src/common';
import { User, UserType } from 'src/database/entities';
import type { Response } from 'express';
import { ResponseFormat } from 'src/common/utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserJwtGuard } from 'src/modules/auth/guards';

@ApiTags('Enrollment Module')
@ApiBearerAuth('jwt')
@UseGuards(UserJwtGuard)
@Controller('students')
export class EnrollmentController {
  protected readonly logger = new Logger(EnrollmentController.name);

  constructor(private readonly enrollmentService: EnrollmentService) {}

  @ApiOperation({
    summary: 'Enroll a student into a new admission',
    description:
      'Enrolls a student into a new admission in the system. Only accessible by admin users.',
  })
  @ApiBody({ type: EnrollStudentDto })
  @ApiResponse({
    status: 201,
    description: 'Student successfully enrolled into new admission',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Post(':student_id/enroll')
  async enrollStudent(
    @Res() res: Response,
    @Param('student_id') student_id: string,
    @Body() payload: EnrollStudentDto,
    @CurrentUser() user: User,
  ) {
    const student = await this.enrollmentService.enrollStudent(
      student_id,
      payload,
      user.id,
    );
    return ResponseFormat.success(
      res,
      'Student successfully enrolled into new admission',
      student,
      HttpStatus.CREATED,
    );
  }

  @ApiOperation({
    summary: 'Bulk promote students to the next class',
    description:
      'Promotes multiple students to the next class at once. Only accessible by admin users.',
  })
  @ApiBody({ type: BulkPromoteDto, isArray: true })
  @ApiResponse({
    status: 200,
    description: 'Students successfully promoted',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Post('bulk-promote')
  async bulkPromote(
    @Res() res: Response,
    @Param('current_arm_id') current_arm_id: string,
    @Body() payload: BulkPromoteDto,
    @CurrentUser() user: User,
  ) {
    const result = await this.enrollmentService.bulkPromote(
      current_arm_id,
      payload,
      user.id,
    );
    return ResponseFormat.success(
      res,
      'Students successfully promoted',
      result,
      HttpStatus.OK,
    );
  }

  @ApiOperation({
    summary: 'Get student enrollment history',
    description:
      'Retrieves the enrollment history of a specific student. Only accessible by admin users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Student enrollment history retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Get(':student_id/enrollment-history')
  async enrollmentHistory(
    @Res() res: Response,
    @Param('student_id') student_id: string,
  ) {
    const history =
      await this.enrollmentService.getEnrollmentHistory(student_id);
    return ResponseFormat.success(
      res,
      'Student enrollment history retrieved successfully',
      history,
      HttpStatus.OK,
    );
  }

  @ApiOperation({
    summary: 'Classify a student into a class',
    description:
      'Classifies a student into a specific class. Only accessible by admin users.',
  })
  @ApiBody({ type: ClassifyStudentDto })
  @ApiResponse({
    status: 200,
    description: 'Student successfully classified into class',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Patch(':student_id/classify')
  async classifyStudent(
    @Res() res: Response,
    @Param('student_id') student_id: string,
    @Body() payload: ClassifyStudentDto,
    @CurrentUser() user: User,
  ) {
    const { class_arm_id } = payload;
    const classify = await this.enrollmentService.classifyStudent(
      student_id,
      class_arm_id,
      user.id,
    );
    return ResponseFormat.success(
      res,
      'Student successfully classified into class',
      classify,
      HttpStatus.OK,
    );
  }

  @ApiOperation({
    summary: "Change a student's class arm",
    description:
      'Changes the class arm of a specific student. Only accessible by admin users.',
  })
  @ApiBody({ type: ClassifyStudentDto })
  @ApiResponse({
    status: 200,
    description: "Student's class arm changed successfully",
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Patch(':student_id/change-arm')
  async changeArm(
    @Res() res: Response,
    @Param('student_id') student_id: string,
    @Body() payload: ClassifyStudentDto,
    @CurrentUser() user: User,
  ) {
    const { class_arm_id } = payload;
    const changeArm = await this.enrollmentService.changeArm(
      student_id,
      class_arm_id,
      user.id,
    );
    return ResponseFormat.success(
      res,
      'Students class arm changed successfully',
      changeArm,
      HttpStatus.OK,
    );
  }

  @ApiOperation({
    summary: 'Promote a student to the next class',
    description:
      'Promotes a student to the next class. Only accessible by admin users.',
  })
  @ApiBody({ type: PromoteStudentDto })
  @ApiResponse({
    status: 200,
    description: 'Student successfully promoted',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Patch(':student_id/promote')
  async promoteStudent(
    @Res() res: Response,
    @Param('student_id') student_id: string,
    @Body() payload: PromoteStudentDto,
    @CurrentUser() user: User,
  ) {
    const promote = await this.enrollmentService.promoteStudent(
      student_id,
      payload,
      user.id,
    );
    return ResponseFormat.success(
      res,
      'Student successfully promoted',
      promote,
      HttpStatus.OK,
    );
  }

  @ApiOperation({
    summary: "Repeat a student's class",
    description:
      'Makes a student repeat the current class. Only accessible by admin users.',
  })
  @ApiBody({ type: PromoteStudentDto })
  @ApiResponse({
    status: 200,
    description: 'Student successfully repeated class',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Patch(':student_id/repeat-class')
  async repeatClass(
    @Res() res: Response,
    @Param('student_id') student_id: string,
    @Body() payload: PromoteStudentDto,

    @CurrentUser() user: User,
  ) {
    const repeat = await this.enrollmentService.repeatClass(
      student_id,
      payload,
      user.id,
    );
    return ResponseFormat.success(
      res,
      'Student successfully repeated class',
      repeat,
      HttpStatus.OK,
    );
  }
}
