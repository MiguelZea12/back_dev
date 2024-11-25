import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { CreateAssignmentDto } from './dto/createAssignment.dto';
import { UpdateAssignmentDto } from './dto/updateAssignment.dto';
import { User } from '@/user/user.entity';
import { Team } from '@/team/entities/team.entity';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    private readonly i18n: I18nService,
  ) {}

  async findAll(): Promise<Assignment[]> {
    const assignments = await this.assignmentRepository.find({
      relations: ['user', 'team'],
    });
    console.log(await this.i18n.t('assignment.assignments_list'));
    return assignments;
  }

  async findByTeamId(teamId: number): Promise<Assignment[]> {
    const assignments = await this.assignmentRepository.find({
      where: { team: { id: teamId } },
      relations: ['user', 'team'],
    });
    return assignments;
  }

  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    const user = await this.userRepository.findOne({
      where: { id: createAssignmentDto.userId },
    });
    const team = await this.teamRepository.findOne({
      where: { id: createAssignmentDto.teamId },
    });

    if (!user || !team) {
      const errorMsg = await this.i18n.t('assignment.error_user_or_team_not_found');
      throw new NotFoundException(errorMsg);
    }

    const existingAssignment = await this.assignmentRepository.findOne({
      where: { user, team },
    });
    if (existingAssignment) {
      const errorMsg = await this.i18n.t('assignment.error_user_already_assigned');
      throw new ConflictException(errorMsg);
    }

    const assignment = this.assignmentRepository.create({ user, team });
    const savedAssignment = await this.assignmentRepository.save(assignment);

    console.log(await this.i18n.t('assignment.assignment_created'));
    return savedAssignment;
  }

  async update(
    id: number,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['user', 'team'],
    });
    if (!assignment) {
      const errorMsg = await this.i18n.t('assignment.error_assignment_not_found', { args: { id } });
      throw new NotFoundException(errorMsg);
    }

    if (updateAssignmentDto.userId) {
      assignment.user = await this.userRepository.findOneOrFail({
        where: { id: updateAssignmentDto.userId },
      });
    }
    if (updateAssignmentDto.teamId) {
      assignment.team = await this.teamRepository.findOneOrFail({
        where: { id: updateAssignmentDto.teamId },
      });
    }

    const updatedAssignment = await this.assignmentRepository.save(assignment);
    console.log(await this.i18n.t('assignment.assignment_updated'));
    return updatedAssignment;
  }

  async remove(id: number): Promise<void> {
    const result = await this.assignmentRepository.delete(id);
    if (result.affected === 0) {
      const errorMsg = await this.i18n.t('assignment.error_assignment_not_found', { args: { id } });
      throw new NotFoundException(errorMsg);
    }

    console.log(await this.i18n.t('assignment.assignment_deleted'));
  }
}
