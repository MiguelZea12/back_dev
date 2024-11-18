import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
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
    private readonly i18n: I18nService, // Inyección de I18nService
  ) {}

  async findAll(): Promise<Team[]> {
    return await this.teamRepository.find({ relations: ['workGroup'] });
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { id }, relations: ['workGroup'] });
    if (!team) {
      const errorMessage = await this.i18n.translate('errors.team.not_found', { args: { id } }) as string;
      throw new NotFoundException(errorMessage);
    }
    return team;
  }

  async create(createTeamDto: CreateTeamDto): Promise<{ team: Team; message: string }> {
    const workGroup = await this.workGroupRepository.findOne({ where: { id: createTeamDto.workGroupId } });
    if (!workGroup) {
      const errorMessage = await this.i18n.translate('errors.workgroup.not_found', { args: { id: createTeamDto.workGroupId } }) as string;
      throw new NotFoundException(errorMessage);
    }

    const team = this.teamRepository.create({ ...createTeamDto, workGroup });
    const savedTeam = await this.teamRepository.save(team);
    const message = await this.i18n.translate('team.created') as string;
    return { team: savedTeam, message };
  }

  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<{ team: Team; message: string }> {
    const team = await this.findOne(id);
    Object.assign(team, updateTeamDto);

    const updatedTeam = await this.teamRepository.save(team);
    const message = await this.i18n.translate('team.updated', { args: { id } }) as string;
    return { team: updatedTeam, message };
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.teamRepository.delete(id);
    if (result.affected === 0) {
      const errorMessage = await this.i18n.translate('errors.team.not_found', { args: { id } }) as string;
      throw new NotFoundException(errorMessage);
    }
    const message = await this.i18n.translate('team.deleted', { args: { id } }) as string;
    return { message };
  }
}
