import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';

import { ResponseFormat } from 'src/common/utils';
import { UserType } from 'src/database/entities';
import { CreateClassDto, CreateClassArmDto } from '../../dtos/class.dto';
import { ClassService } from '../../services/class/class.service';
import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserJwtGuard } from 'src/modules/auth/guards';

@ApiTags('Class Module')
@Controller('class')
export class ClassController {
  protected readonly logger = new Logger(ClassController.name);

  constructor(private readonly classService: ClassService) {}
  @ApiOperation({
    summary: 'Create a new class',
    description:
      'Creates a new class in the system. Only accessible by admin users.',
  })
  @ApiBody({ type: CreateClassDto })
  @ApiResponse({ status: 201, description: 'User create successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiBearerAuth('jwt')
  @UseGuards(UserJwtGuard)
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @Post()
  async createClass(@Res() res: Response, @Body() payload: CreateClassDto) {
    const newClass = await this.classService.create(payload);
    return ResponseFormat.success(res, 'Class created successfully', newClass);
  }

  @ApiOperation({
    summary: 'Add a new arm to a class',
    description:
      'Adds a new arm to an existing class. Only accessible by admin users.',
  })
  @ApiBody({ type: CreateClassArmDto })
  @ApiResponse({ status: 201, description: 'Class arm created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiBearerAuth('jwt')
  @UseGuards(UserJwtGuard)
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @Post(':classId/arms')
  async createArms(
    @Res() res: Response,
    @Body() payload: CreateClassArmDto,
    @Param('classId') classId: string,
  ) {
    const arm = await this.classService.addArm(classId, payload);
    return ResponseFormat.success(
      res,
      'Class arms is successfully created',
      arm,
    );
  }

  @ApiOperation({ summary: 'Get all classes' })
  @ApiResponse({ status: 200, description: 'Classes retrieved successfully' })
  @ApiBearerAuth('jwt')
  @UseGuards(UserJwtGuard)
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @Get()
  async getAllClass(@Res() res: Response) {
    const AllClass = await this.classService.getAllClass();
    return ResponseFormat.success(
      res,
      'Classes retrieved successfully',
      AllClass,
    );
  }

  @ApiOperation({ summary: 'Get class by ID' })
  @ApiResponse({ status: 200, description: 'Class retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  @ApiBearerAuth('jwt')
  @UseGuards(UserJwtGuard)
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @Get(':id')
  async getClassById(@Res() res: Response, @Param('id') id: string) {
    const oneClass = await this.classService.findClass(id);
    return ResponseFormat.success(
      res,
      'Class retrieved successfully',
      oneClass,
    );
  }

  @ApiOperation({ summary: 'Deactivate a class' })
  @ApiResponse({ status: 200, description: 'Class deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  @ApiBearerAuth('jwt')
  @UseGuards(UserJwtGuard)
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @Patch(':id/deactivate')
  async deactivateClass(@Res() res: Response, @Param('id') id: string) {
    const deactivatedClass = await this.classService.deactivateClass(id);
    return ResponseFormat.success(
      res,
      'Class deactivated successfully',
      deactivatedClass,
    );
  }

  @ApiOperation({ summary: 'Activate a class' })
  @ApiResponse({ status: 200, description: 'Class activated successfully' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  @ApiBearerAuth('jwt')
  @UseGuards(UserJwtGuard)
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @Patch(':id/activate')
  async activateClass(@Res() res: Response, @Param('id') id: string) {
    const activatedClass = await this.classService.activateClass(id);
    return ResponseFormat.success(
      res,
      'Class activated successfully',
      activatedClass,
    );
  }

  // @ApiOperation({ summary: 'Assign a teacher to a class arm' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Teacher assigned to class arm successfully',
  // })
  // @ApiBearerAuth('jwt')
  // @UseGuards(UserJwtGuard)
  // @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  // @Patch(':classId/arms/:armId/teachers/:teacherId')
  // async assignTeacherToArm(
  //   @Res() res: Response,
  //   @Param('classId') classId: string,
  //   @Param('armId') armId: string,
  //   @Param('teacherId') teacherId: string,
  // ) {
  //   const assignedArm = await this.classService.assignTeacherToArm(
  //     classId,
  //     armId,
  //     teacherId,
  //   );
  //   return ResponseFormat.success(
  //     res,
  //     'Teacher assigned to class arm successfully',
  //     assignedArm,
  //   );
  // }

  // @ApiOperation({ summary: 'Assign a bursar to a class arm' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Bursar assigned to class arm successfully',
  // })
  // @ApiBearerAuth('jwt')
  // @UseGuards(UserJwtGuard)
  // @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  // @Patch(':classId/arms/:armId/bursars/:bursarId')
  // async assignBursarToArm(
  //   @Res() res: Response,
  //   @Param('classId') classId: string,
  //   @Param('armId') armId: string,
  //   @Param('bursarId') bursarId: string,
  // ) {
  //   const assignedArm = await this.classService.assignBursarToClass(
  //     classId,
  //     armId,
  //     bursarId,
  //   );
  //   return ResponseFormat.success(
  //     res,
  //     'Bursar assigned to class arm successfully',
  //     assignedArm,
  //   );
  // }
}
