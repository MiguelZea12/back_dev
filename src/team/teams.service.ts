import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/createTeam.dto';
import { UpdateTeamDto } from './dto/updateTeam.dto';
import { WorkGroup } from '@/workgroup/entities/workgroup.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(WorkGroup)
    private readonly workGroupRepository: Repository<WorkGroup>,
  ) {}

  async findAll(): Promise<Team[]> {
    return await this.teamRepository.find({ relations: ['workGroup'] });
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { id }, relations: ['workGroup'] });
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const workGroup = await this.workGroupRepository.findOne({ where: { id: createTeamDto.workGroupId } });
    if (!workGroup) {
      throw new NotFoundException('WorkGroup not found');
    }

    const team = this.teamRepository.create({ ...createTeamDto, workGroup });
    return await this.teamRepository.save(team);
  }

  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);
    Object.assign(team, updateTeamDto);

    return await this.teamRepository.save(team);
  }

  async remove(id: number): Promise<void> {
    const result = await this.teamRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Team not found');
    }
  }
}
