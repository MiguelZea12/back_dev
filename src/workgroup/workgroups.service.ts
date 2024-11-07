import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkGroup } from './entities/workgroup.entity';
import { CreateWorkGroupDto } from './dto/createWorkgroup.dto';
import { UpdateWorkGroupDto } from './dto/updateWorkgroup.dto';

@Injectable()
export class WorkGroupsService {
  constructor(
    @InjectRepository(WorkGroup)
    private readonly workGroupRepository: Repository<WorkGroup>,
  ) {}

  async findAll(): Promise<WorkGroup[]> {
    return await this.workGroupRepository.find({ relations: ['teams'] });
  }

  async findOne(id: number): Promise<WorkGroup> {
    const workGroup = await this.workGroupRepository.findOne({ where: { id }, relations: ['teams'] });
    if (!workGroup) {
      throw new NotFoundException('WorkGroup not found');
    }
    return workGroup;
  }

  async create(createWorkGroupDto: CreateWorkGroupDto): Promise<WorkGroup> {
    const workGroup = this.workGroupRepository.create(createWorkGroupDto);
    return await this.workGroupRepository.save(workGroup);
  }

  async update(id: number, updateWorkGroupDto: UpdateWorkGroupDto): Promise<WorkGroup> {
    const workGroup = await this.findOne(id);
    Object.assign(workGroup, updateWorkGroupDto);

    return await this.workGroupRepository.save(workGroup);
  }

  async remove(id: number): Promise<void> {
    const result = await this.workGroupRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('WorkGroup not found');
    }
  }
}
