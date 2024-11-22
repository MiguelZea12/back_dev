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
    const logMessage = await this.i18n.translate('assignment.fetching_all');
    this.logger.log(logMessage);

    try {
      return await this.assignmentsService.findAll();
    } catch (error) {
      const errorMessage = await this.i18n.translate('assignment.errors.fetch_all');
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/team/:teamId')
  async findByTeamId(
    @Param('teamId') teamId: number,
  ): Promise<{ assignments: Assignment[]; message: string }> {
    const logMessage = await this.i18n.translate('assignment.fetching_by_team', { args: { teamId } });
    this.logger.log(logMessage);

    try {
      return await this.assignmentsService.findByTeamId(teamId);
    } catch (error) {
      const errorMessage = await this.i18n.translate('assignment.errors.fetch_by_team', { args: { teamId } });
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async create(@Body() createAssignmentDto: CreateAssignmentDto): Promise<{ assignment: Assignment; message: string }> {
    const logMessage = await this.i18n.translate('assignment.creating_assignment');
    this.logger.log(logMessage);

    try {
      return await this.assignmentsService.create(createAssignmentDto);
    } catch (error) {
      const errorMessage = await this.i18n.translate('assignment.errors.creating_assignment');
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<{ assignment: Assignment; message: string }> {
    const logMessage = await this.i18n.translate('assignment.updating_assignment', { args: { id } });
    this.logger.log(logMessage);

    try {
      return await this.assignmentsService.update(id, updateAssignmentDto);
    } catch (error) {
      const errorMessage = await this.i18n.translate('assignment.errors.updating_assignment', { args: { id } });
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    const logMessage = await this.i18n.translate('assignment.deleting_assignment', { args: { id } });
    this.logger.log(logMessage);

    try {
      return await this.assignmentsService.remove(id);
    } catch (error) {
      const errorMessage = await this.i18n.translate('assignment.errors.deleting_assignment', { args: { id } });
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
