import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkGroup } from './entities/workgroup.entity';
import { CreateWorkGroupDto } from './dto/createWorkgroup.dto';
import { UpdateWorkGroupDto } from './dto/updateWorkgroup.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class WorkGroupsService {
  constructor(
    @InjectRepository(WorkGroup)
    private readonly workGroupRepository: Repository<WorkGroup>,
    private readonly i18n: I18nService,
  ) {}

  async findAll(): Promise<WorkGroup[]> {
    const workGroups = await this.workGroupRepository.find({ relations: ['teams'] });
    if (!workGroups.length) {
      throw new NotFoundException(this.i18n.t('workgroup.not_found', { args: { id: 'all' } }));
    }
    return workGroups;
  }

  async findOne(id: number): Promise<WorkGroup> {
    const workGroup = await this.workGroupRepository.findOne({ where: { id }, relations: ['teams'] });
    if (!workGroup) {
      throw new NotFoundException(this.i18n.t('workgroup.not_found', { args: { id } }));
    }
    return workGroup;
  }

  async create(createWorkGroupDto: CreateWorkGroupDto): Promise<WorkGroup> {
    const workGroup = this.workGroupRepository.create(createWorkGroupDto);
    const savedWorkGroup = await this.workGroupRepository.save(workGroup);
    console.log(this.i18n.t('workgroup.created'));
    return savedWorkGroup;
  }

  async update(id: number, updateWorkGroupDto: UpdateWorkGroupDto): Promise<WorkGroup> {
    const workGroup = await this.findOne(id);
    Object.assign(workGroup, updateWorkGroupDto);
    const updatedWorkGroup = await this.workGroupRepository.save(workGroup);
    console.log(this.i18n.t('workgroup.updated'));
    return updatedWorkGroup;
  }

  async remove(id: number): Promise<void> {
    const result = await this.workGroupRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(this.i18n.t('workgroup.not_found', { args: { id } }));
    }
    console.log(this.i18n.t('workgroup.deleted'));
  }
}
