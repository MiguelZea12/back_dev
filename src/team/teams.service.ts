import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/createTeam.dto';
import { UpdateTeamDto } from './dto/updateTeam.dto';
import { WorkGroup } from '@/workgroup/entities/workgroup.entity';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(WorkGroup)
    private readonly workGroupRepository: Repository<WorkGroup>,
    private readonly i18n: I18nService,
  ) {}

  async findAll(): Promise<Team[]> {
    const teams = await this.teamRepository.find({ relations: ['workGroup'] });
    return teams;
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { id }, relations: ['workGroup'] });
    if (!team) {
      const errorMsg = await this.i18n.t('team.error_team_not_found', { args: { id } });
      throw new NotFoundException(errorMsg);
    }
    return team;
  }

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const workGroup = await this.workGroupRepository.findOne({ where: { id: createTeamDto.workGroupId } });
    if (!workGroup) {
      const errorMsg = await this.i18n.t('team.error_workgroup_not_found', {
        args: { id: createTeamDto.workGroupId },
      });
      throw new NotFoundException(errorMsg);
    }

    const team = this.teamRepository.create({ ...createTeamDto, workGroup });
    const savedTeam = await this.teamRepository.save(team);

    const successMsg = await this.i18n.t('team.team_created');
    console.log(successMsg);

    return savedTeam;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);
    Object.assign(team, updateTeamDto);

    const updatedTeam = await this.teamRepository.save(team);

    const successMsg = await this.i18n.t('team.team_updated');
    console.log(successMsg);

    return updatedTeam;
  }

  async remove(id: number): Promise<void> {
    const result = await this.teamRepository.delete(id);
    if (result.affected === 0) {
      const errorMsg = await this.i18n.t('team.error_team_not_found', { args: { id } });
      throw new NotFoundException(errorMsg);
    }

    const successMsg = await this.i18n.t('team.team_deleted');
    console.log(successMsg);
  }
}
