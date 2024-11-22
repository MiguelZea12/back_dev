import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { Assignment } from './entities/assignment.entity';
import { CreateAssignmentDto } from './dto/createAssignment.dto';
import { UpdateAssignmentDto } from './dto/updateAssignment.dto';
import { User } from '@/user/user.entity';
import { Team } from '@/team/entities/team.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    private readonly i18n: I18nService, // Inyección de I18nService
  ) {}

  async findAll(): Promise<{ assignments: Assignment[]; message: string }> {
    const assignments = await this.assignmentRepository.find({ relations: ['user', 'team'] });
    const message = await this.i18n.translate('assignment.success.list') as string;
    return { assignments, message };
  }

  async findByTeamId(teamId: number): Promise<{ assignments: Assignment[]; message: string }> {
    const assignments = await this.assignmentRepository.find({
      where: { team: { id: teamId } },
      relations: ['user', 'team'],
    });
    const message = await this.i18n.translate('assignment.success.list_by_team', { args: { teamId } }) as string;
    return { assignments, message };
  }

  async create(createAssignmentDto: CreateAssignmentDto): Promise<{ assignment: Assignment; message: string }> {
    const user = await this.userRepository.findOne({ where: { id: createAssignmentDto.userId } });
    const team = await this.teamRepository.findOne({ where: { id: createAssignmentDto.teamId } });

    if (!user || !team) {
      const errorMessage = await this.i18n.translate('assignment.errors.user_or_team_not_found') as string;
      throw new NotFoundException(errorMessage);
    }

    const existingAssignment = await this.assignmentRepository.findOne({
      where: { user, team },
    });
    if (existingAssignment) {
      const errorMessage = await this.i18n.translate('assignment.errors.already_assigned') as string;
      throw new InternalServerErrorException(errorMessage);
    }

    const assignment = this.assignmentRepository.create({ user, team });
    const savedAssignment = await this.assignmentRepository.save(assignment);
    const message = await this.i18n.translate('assignment.success.created') as string;
    return { assignment: savedAssignment, message };
  }

  async update(
    id: number,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<{ assignment: Assignment; message: string }> {
    const assignment = await this.assignmentRepository.findOne({ where: { id }, relations: ['user', 'team'] });
    if (!assignment) {
      const errorMessage = await this.i18n.translate('assignment.errors.not_found', { args: { id } }) as string;
      throw new NotFoundException(errorMessage);
    }

    if (updateAssignmentDto.userId) {
      assignment.user = await this.userRepository.findOneOrFail({ where: { id: updateAssignmentDto.userId } });
    }
    if (updateAssignmentDto.teamId) {
      assignment.team = await this.teamRepository.findOneOrFail({ where: { id: updateAssignmentDto.teamId } });
    }

    const updatedAssignment = await this.assignmentRepository.save(assignment);
    const message = await this.i18n.translate('assignment.success.updated', { args: { id } }) as string;
    return { assignment: updatedAssignment, message };
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.assignmentRepository.delete(id);
    if (result.affected === 0) {
      const errorMessage = await this.i18n.translate('assignment.errors.not_found', { args: { id } }) as string;
      throw new NotFoundException(errorMessage);
    }

    const message = await this.i18n.translate('assignment.success.deleted', { args: { id } }) as string;
    return { message };
  }
}
