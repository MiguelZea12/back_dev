import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { WorkGroup } from './entities/workgroup.entity';
import { CreateWorkGroupDto } from './dto/createWorkgroup.dto';
import { UpdateWorkGroupDto } from './dto/updateWorkgroup.dto';

@Injectable()
export class WorkGroupsService {
  constructor(
    @InjectRepository(WorkGroup)
    private readonly workGroupRepository: Repository<WorkGroup>,
    private readonly i18n: I18nService, // Inyección de I18nService
  ) {}

  async findAll(): Promise<WorkGroup[]> {
    return await this.workGroupRepository.find({ relations: ['teams'] });
  }

  async findOne(id: number): Promise<WorkGroup> {
    const workGroup = await this.workGroupRepository.findOne({ where: { id }, relations: ['teams'] });
    if (!workGroup) {
      const errorMessage = await this.i18n.translate('errors.workgroup.not_found', { args: { id } }) as string;
      throw new NotFoundException(errorMessage);
    }
    return workGroup;
  }

  async create(createWorkGroupDto: CreateWorkGroupDto): Promise<{ workGroup: WorkGroup; message: string }> {
    const workGroup = this.workGroupRepository.create(createWorkGroupDto);
    const savedWorkGroup = await this.workGroupRepository.save(workGroup);
    const message = await this.i18n.translate('workgroup.created') as string;
    return { workGroup: savedWorkGroup, message };
  }

  async update(id: number, updateWorkGroupDto: UpdateWorkGroupDto): Promise<{ workGroup: WorkGroup; message: string }> {
    const workGroup = await this.findOne(id);
    Object.assign(workGroup, updateWorkGroupDto);
    const updatedWorkGroup = await this.workGroupRepository.save(workGroup);
    const message = await this.i18n.translate('workgroup.updated', { args: { id } }) as string;
    return { workGroup: updatedWorkGroup, message };
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.workGroupRepository.delete(id);
    if (result.affected === 0) {
      const errorMessage = await this.i18n.translate('errors.workgroup.not_found', { args: { id } }) as string;
      throw new NotFoundException(errorMessage);
    }
    const message = await this.i18n.translate('workgroup.deleted', { args: { id } }) as string;
    return { message };
  }
}
