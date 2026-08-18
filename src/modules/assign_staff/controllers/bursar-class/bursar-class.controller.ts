import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AssignStaffService } from '../../services/bursar-class/bursar-class.service';
import { Response } from 'express';
import { ResponseFormat } from 'src/common/utils';
import { AssignStaffDto } from '../../dtos/assign.dto';
import { CurrentUser } from 'src/common';
import { User, UserType } from 'src/database/entities';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserJwtGuard } from 'src/modules/auth/guards';

@ApiTags('Staff Assignment Module')
@ApiBearerAuth('jwt')
@UseGuards(UserJwtGuard)
@Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
@Controller('assign-staff')
export class AssignStaffController {
  protected readonly logger = new Logger(AssignStaffController.name);

  constructor(private readonly assignStaffService: AssignStaffService) {}

  @ApiBody({ type: AssignStaffDto })
  @ApiOperation({ summary: 'Assign bursar staff to a class arm' })
  @ApiResponse({ status: 201, description: 'Bursar assigned successfully' })
  @Post('bursar')
  async assignBursar(
    @Res() res: Response,
    @Body() payload: AssignStaffDto,
    @CurrentUser() user: User,
  ) {
    const { user_id, class_arm_id, session_id } = payload;
    const assign = await this.assignStaffService.assignBursar(
      user_id,
      class_arm_id,
      session_id,
      user.id,
    );
    return ResponseFormat.success(
      res,
      'Bursar assigned successfully ',
      assign,
      HttpStatus.CREATED,
    );
  }

  @ApiBody({ type: AssignStaffDto })
  @ApiOperation({ summary: 'Assign Teacher to a class arm' })
  @ApiResponse({ status: 201, description: 'Teacher assigned successfully' })
  @Post('teacher')
  async assignTeacher(
    @Res() res: Response,
    @Body() payload: AssignStaffDto,
    @CurrentUser() user: User,
  ) {
    const { user_id, class_arm_id, session_id } = payload;
    const assign = await this.assignStaffService.assignTeacher(
      user_id,
      class_arm_id,
      session_id,
      user.id,
    );
    return ResponseFormat.success(
      res,
      'Teacher assigned successfully',
      assign,
      HttpStatus.CREATED,
    );
  }

  @Get()
  async getUserAssignments(
    @Res() res: Response,
    @Param('user_id') user_id: string,
  ) {
    const assignments =
      await this.assignStaffService.getUserAssignments(user_id);
    return ResponseFormat.success(
      res,
      'User assignments retrieved successfully',
      assignments,
      HttpStatus.OK,
    );
  }

  @Delete(':id')
  async removeAssignment(@Res() res: Response, @Param('id') id: string) {
    await this.assignStaffService.removeAssignment(id);
    return ResponseFormat.success(
      res,
      'Assignment removed successfully',
      null,
      HttpStatus.OK,
    );
  }
}
