import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/createTeam.dto';
import { UpdateTeamDto } from './dto/updateTeam.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async findAll() {
    return await this.teamsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.teamsService.findOne(id);
  }

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    return await this.teamsService.create(createTeamDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTeamDto: UpdateTeamDto) {
    return await this.teamsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.teamsService.remove(id);
  }
}
