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

  async findAll(): Promise<{ workGroups: WorkGroup[]; message: string }> {
    const workGroups = await this.workGroupRepository.find({ relations: ['teams'] });
    const message = await this.i18n.translate('workgroup.success.fetched_all') as string;
    return { workGroups, message };
  }

  async findOne(id: number): Promise<{ workGroup: WorkGroup; message: string }> {
    const workGroup = await this.workGroupRepository.findOne({ where: { id }, relations: ['teams'] });
    if (!workGroup) {
      const errorMessage = await this.i18n.translate('workgroup.errors.not_found', { args: { id } }) as string;
      throw new NotFoundException(errorMessage);
    }
    const message = await this.i18n.translate('workgroup.success.found', { args: { id } }) as string;
    return { workGroup, message };
  }

  async create(createWorkGroupDto: CreateWorkGroupDto): Promise<{ workGroup: WorkGroup; message: string }> {
    const workGroup = this.workGroupRepository.create(createWorkGroupDto);
    const savedWorkGroup = await this.workGroupRepository.save(workGroup);
    const message = await this.i18n.translate('workgroup.success.created') as string;
    return { workGroup: savedWorkGroup, message };
  }

  async update(id: number, updateWorkGroupDto: UpdateWorkGroupDto): Promise<{ workGroup: WorkGroup; message: string }> {
    const workGroup = await this.workGroupRepository.findOne({ where: { id } });
    if (!workGroup) {
      const errorMessage = await this.i18n.translate('workgroup.errors.not_found', { args: { id } }) as string;
      throw new NotFoundException(errorMessage);
    }
    Object.assign(workGroup, updateWorkGroupDto);
    const updatedWorkGroup = await this.workGroupRepository.save(workGroup);
    const message = await this.i18n.translate('workgroup.success.updated', { args: { id } }) as string;
    return { workGroup: updatedWorkGroup, message };
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.workGroupRepository.delete(id);
    if (result.affected === 0) {
      const errorMessage = await this.i18n.translate('workgroup.errors.not_found', { args: { id } }) as string;
      throw new NotFoundException(errorMessage);
    }
    const message = await this.i18n.translate('workgroup.success.deleted', { args: { id } }) as string;
    return { message };
  }
}
