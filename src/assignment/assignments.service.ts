import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async findAll(): Promise<Assignment[]> {
    return await this.assignmentRepository.find({ relations: ['user', 'team'] });
  }

  async findByTeamId(teamId: number): Promise<Assignment[]> {
    return await this.assignmentRepository.find({
      where: { team: { id: teamId } },
      relations: ['user', 'team'],
    });
  }

  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    const user = await this.userRepository.findOne({ where: { id: createAssignmentDto.userId } });
    const team = await this.teamRepository.findOne({ where: { id: createAssignmentDto.teamId } });

    if (!user || !team) {
      throw new NotFoundException('User or Team not found');
    }

    const existingAssignment = await this.assignmentRepository.findOne({
      where: { user, team },
    });
    if (existingAssignment) {
      throw new Error('The user is already assigned to this team');
    }

    const assignment = this.assignmentRepository.create({ user, team });
    return await this.assignmentRepository.save(assignment);
  }

  async update(id: number, updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({ where: { id }, relations: ['user', 'team'] });
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (updateAssignmentDto.userId) {
      assignment.user = await this.userRepository.findOneOrFail({ where: { id: updateAssignmentDto.userId } });
    }
    if (updateAssignmentDto.teamId) {
      assignment.team = await this.teamRepository.findOneOrFail({ where: { id: updateAssignmentDto.teamId } });
    }

    return await this.assignmentRepository.save(assignment);
  }

  async remove(id: number): Promise<void> {
    const result = await this.assignmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Assignment not found');
    }
  }
}
