import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { WorkGroupsService } from './workgroups.service';
import { CreateWorkGroupDto } from './dto/createWorkgroup.dto';
import { UpdateWorkGroupDto } from './dto/updateWorkgroup.dto';

@Controller('workgroups')
export class WorkGroupsController {
  constructor(private readonly workGroupsService: WorkGroupsService) {}

  @Get()
  async findAll() {
    return await this.workGroupsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.workGroupsService.findOne(id);
  }

  @Post()
  async create(@Body() createWorkGroupDto: CreateWorkGroupDto) {
    return await this.workGroupsService.create(createWorkGroupDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateWorkGroupDto: UpdateWorkGroupDto) {
    return await this.workGroupsService.update(id, updateWorkGroupDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.workGroupsService.remove(id);
  }
}
