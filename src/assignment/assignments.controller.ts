import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { I18nService } from 'nestjs-i18n';
import { CreateAssignmentDto } from './dto/createAssignment.dto';
import { UpdateAssignmentDto } from './dto/updateAssignment.dto';
import { Assignment } from './entities/assignment.entity';

@Controller('assignments')
export class AssignmentsController {
  private readonly logger = new Logger(AssignmentsController.name);

  constructor(
    private readonly assignmentsService: AssignmentsService,
    private readonly i18n: I18nService,
  ) {}

  @Get()
  async findAll(): Promise<{ assignments: Assignment[]; message: string }> {
    const logMessage = await this.i18n.translate('assignment.fetching_all') as string;
    this.logger.log(logMessage);

    try {
      const assignments = await this.assignmentsService.findAll();
      const message = await this.i18n.translate('assignment.assignments_list') as string;
      return { assignments, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('assignment.error_fetching_assignments') as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/team/:teamId')
  async findByTeamId(
    @Param('teamId') teamId: number,
  ): Promise<{ assignments: Assignment[]; message: string }> {
    const logMessage = await this.i18n.translate('assignment.fetching_by_team', { args: { teamId } }) as string;
    this.logger.log(logMessage);

    try {
      const assignments = await this.assignmentsService.findByTeamId(teamId);
      const message = await this.i18n.translate('assignment.assignments_by_team') as string;
      return { assignments, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('assignment.error_fetching_by_team', { args: { teamId } }) as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async create(@Body() createAssignmentDto: CreateAssignmentDto): Promise<{ assignment: Assignment; message: string }> {
    const logMessage = await this.i18n.translate('assignment.creating_assignment') as string;
    this.logger.log(logMessage);

    try {
      const assignment = await this.assignmentsService.create(createAssignmentDto);
      const message = await this.i18n.translate('assignment.assignment_created') as string;
      return { assignment, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('assignment.error_creating_assignment') as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<{ assignment: Assignment; message: string }> {
    const logMessage = await this.i18n.translate('assignment.updating_assignment', { args: { id } }) as string;
    this.logger.log(logMessage);

    try {
      const assignment = await this.assignmentsService.update(id, updateAssignmentDto);
      const message = await this.i18n.translate('assignment.assignment_updated', { args: { id } }) as string;
      return { assignment, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('assignment.error_updating_assignment', { args: { id } }) as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    const logMessage = await this.i18n.translate('assignment.deleting_assignment', { args: { id } }) as string;
    this.logger.log(logMessage);

    try {
      await this.assignmentsService.remove(id);
      const message = await this.i18n.translate('assignment.assignment_deleted', { args: { id } }) as string;
      return { message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('assignment.error_deleting_assignment', { args: { id } }) as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
