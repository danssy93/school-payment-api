import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';

import {
  BulkUploadStudentDto,
  ChangeStudentStatusDto,
  CreateStudentDto,
  UpdateStudentDto,
} from '../../dtos/student.dto';
import { CurrentUser } from 'src/common';
import { User, UserType } from 'src/database/entities';
import { ResponseFormat } from 'src/common/utils';
import type { Response } from 'express';
import { FilterStudentDto } from '../../dtos/pagination.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserJwtGuard } from 'src/modules/auth/guards';
import { StudentService } from '../../services/student/student.service';

@ApiTags('Students Module')
@ApiBearerAuth('jwt')
@UseGuards(UserJwtGuard)
@Controller('students')
export class StudentController {
  protected readonly logger = new Logger(StudentController.name);

  constructor(private readonly studentService: StudentService) {}

  @ApiOperation({
    summary: 'Register a new student',
    description:
      'Registers a new student in the system. Only accessible by admin users.',
  })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({ status: 201, description: 'Student successfully registered' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Post('register')
  async registerStudent(
    @Res() res: Response,
    @Body() payload: CreateStudentDto,
    @CurrentUser() user: User,
  ) {
    const student = await this.studentService.registerStudent(payload, user.id);
    return ResponseFormat.success(
      res,
      'Student successfully registered',
      student,
      HttpStatus.CREATED,
    );
  }

  @ApiOperation({
    summary: 'Bulk upload students',
    description:
      'Uploads multiple students at once. Only accessible by admin users.',
  })
  @ApiBody({ type: BulkUploadStudentDto, isArray: true })
  @ApiResponse({ status: 201, description: 'Students uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Post('bulk-upload')
  async bulkUploadStudents(
    @Res() res: Response,
    @Body() payload: BulkUploadStudentDto[],
    @CurrentUser() user: User,
  ) {
    const students = await this.studentService.bulkUploadStudents(
      payload,
      user.id,
    );
    return ResponseFormat.success(
      res,
      'Students uploaded successfully',
      students,
      HttpStatus.CREATED,
    );
  }

  @ApiOperation({
    summary: 'Get all students',
    description:
      'Retrieves a list of all students. Only accessible by admin users.',
  })
  @ApiResponse({ status: 200, description: 'Students retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No students found' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Get()
  async getAllStudents(
    @Res() res: Response,
    @Body() filters: FilterStudentDto,
  ) {
    const students = await this.studentService.getAllStudents(filters);
    return ResponseFormat.success(
      res,
      'Students retrieved successfully',
      students,
      HttpStatus.OK,
    );
  }

  @ApiOperation({
    summary: 'Get unclassified students',
    description:
      'Retrieves a list of students who are not yet classified. Only accessible by admin users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Unclassified students retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'No unclassified students found' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Get('unclassified')
  async getUnclassifiedStudents(@Res() res: Response) {
    const students = await this.studentService.getUnclassifiedStudents();
    return ResponseFormat.success(
      res,
      'Unclassified students retrieved successfully',
      students,
      HttpStatus.OK,
    );
  }

  @ApiOperation({
    summary: 'Get student by ID',
    description:
      'Retrieves information about a specific student by their ID. Only accessible by admin users.',
  })
  @ApiResponse({ status: 200, description: 'Student retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Get(':student_id')
  async getStudentById(
    @Res() res: Response,
    @Param('student_id') student_id: string,
  ) {
    const student = await this.studentService.findStudent(student_id);
    return ResponseFormat.success(
      res,
      'Student retrieved successfully',
      student,
      HttpStatus.OK,
    );
  }

  @ApiOperation({
    summary: 'Update student information',
    description:
      'Updates the information of an existing student. Only accessible by admin users.',
  })
  @ApiBody({ type: UpdateStudentDto })
  @ApiResponse({ status: 200, description: 'Student updated successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Patch(':student_id')
  async updateStudent(
    @Res() res: Response,
    @Param('student_id') student_id: string,
    @Body() payload: UpdateStudentDto,
  ) {
    const student = await this.studentService.updateStudent(
      student_id,
      payload,
    );
    return ResponseFormat.success(
      res,
      'Student updated successfully',
      student,
      HttpStatus.OK,
    );
  }

  @ApiOperation({
    summary: 'Change student status',
    description:
      'Updates the status of a specific student. Only accessible by admin users.',
  })
  @ApiBody({ type: ChangeStudentStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Student status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Patch()
  async changeStudentStatus(
    @Res() res: Response,
    @Param('student_id') student_id: string,
    @Body() payload: ChangeStudentStatusDto,
  ) {
    const student = await this.studentService.changeStatus(student_id, payload);
    return ResponseFormat.success(
      res,
      'Student status updated successfully',
      student,
      HttpStatus.OK,
    );
  }

  @ApiOperation({
    summary: 'Get students by arm',
    description:
      'Retrieves a list of students belonging to a specific arm. Only accessible by admin users.',
  })
  @ApiResponse({ status: 200, description: 'Students retrieved successfully' })
  @ApiResponse({
    status: 404,
    description: 'No students found for the specified arm',
  })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Get('arm/:arm')
  async getSStudentsByArm(@Res() res: Response, @Param('arm') arm: string) {
    const students = await this.studentService.getStudentsByArm(arm);
    return ResponseFormat.success(
      res,
      'Students retrieved successfully',
      students,
      HttpStatus.OK,
    );
  }

  @ApiOperation({
    summary: 'Delete a student',
    description:
      'Deletes a student from the system. Only accessible by admin users.',
  })
  @ApiResponse({ status: 200, description: 'Student deleted successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Delete(':student_id')
  async deleteStudent(
    @Res() res: Response,
    @Param('student_id') student_id: string,
  ) {
    await this.studentService.deleteStudent(student_id);
    return ResponseFormat.success(
      res,
      'Student deleted successfully',
      null,
      HttpStatus.OK,
    );
  }

  @ApiOperation({
    summary: 'Restore a student',
    description:
      'Restores a deleted student to the system. Only accessible by admin users.',
  })
  @ApiResponse({ status: 200, description: 'Student restored successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN, UserType.BURSAR)
  @Patch('restore/:student_id')
  async restoreStudent(
    @Res() res: Response,
    @Param('student_id') student_id: string,
  ) {
    await this.studentService.restoreStudent(student_id);
    return ResponseFormat.success(
      res,
      'Student restored successfully',
      null,
      HttpStatus.OK,
    );
  }
}
