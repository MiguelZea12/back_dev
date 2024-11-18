import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { I18nService } from 'nestjs-i18n';
import { CreateAssignmentDto } from './dto/createAssignment.dto';
import { UpdateAssignmentDto } from './dto/updateAssignment.dto';
import { Assignment } from './entities/assignment.entity';

@Controller('assignments')
export class AssignmentsController {
  constructor(
    private readonly assignmentsService: AssignmentsService,
    private readonly i18n: I18nService,
  ) {}

  @Get()
  async findAll(): Promise<{ assignments: Assignment[], message: string }> {
    const assignments = await this.assignmentsService.findAll();
    const message = await this.i18n.translate('assignments_list') as string;
    return { assignments, message };
  }

  @Get('/team/:teamId')
  async findByTeamId(@Param('teamId') teamId: number): Promise<{ assignments: Assignment[], message: string }> {
    const assignments = await this.assignmentsService.findByTeamId(teamId);
    const message = await this.i18n.translate('assignments_by_team') as string;
    return { assignments, message };
  }

  @Post()
  async create(@Body() createAssignmentDto: CreateAssignmentDto): Promise<{ assignment: Assignment, message: string }> {
    const assignment = await this.assignmentsService.create(createAssignmentDto);
    const message = await this.i18n.translate('assignment_created') as string;
    return { assignment, message };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateAssignmentDto: UpdateAssignmentDto): Promise<{ assignment: Assignment, message: string }> {
    const assignment = await this.assignmentsService.update(id, updateAssignmentDto);
    const message = await this.i18n.translate('assignment_updated') as string;
    return { assignment, message };
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.assignmentsService.remove(id);
    const message = await this.i18n.translate('assignment_deleted') as string;
    return { message };
  }
}
