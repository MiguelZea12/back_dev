import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/createAssignment.dto';
import { UpdateAssignmentDto } from './dto/updateAssignment.dto';
import { Assignment } from './entities/assignment.entity';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  async findAll(): Promise<Assignment[]> {
    return await this.assignmentsService.findAll();
  }

  @Get('/team/:teamId')
  async findByTeamId(@Param('teamId') teamId: number): Promise<Assignment[]> {
    return await this.assignmentsService.findByTeamId(teamId);
  }

  @Post()
  async create(@Body() createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    return await this.assignmentsService.create(createAssignmentDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment> {
    return await this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.assignmentsService.remove(id);
  }
}
