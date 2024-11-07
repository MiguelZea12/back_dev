import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caregiver } from './entitlies/caregiver.entity';
import { CreateCaregiverDto } from './dto/createCaregiver.dto';
import { UpdateCaregiverDto } from './dto/updateCaregiver.dto';

@Injectable()
export class CaregiversService {
  constructor(
    @InjectRepository(Caregiver)
    private readonly caregiverRepository: Repository<Caregiver>,
  ) {}

  async findAll(): Promise<Caregiver[]> {
    return await this.caregiverRepository.find();
  }

  async findOne(id: number): Promise<Caregiver> {
    const caregiver = await this.caregiverRepository.findOneBy({ id });
    if (!caregiver) {
      throw new NotFoundException('Caregiver not found');
    }
    return caregiver;
  }

  async create(createCaregiverDto: CreateCaregiverDto): Promise<Caregiver> {
    const caregiver = this.caregiverRepository.create(createCaregiverDto);
    return await this.caregiverRepository.save(caregiver);
  }

  async update(id: number, updateCaregiverDto: UpdateCaregiverDto): Promise<Caregiver> {
    await this.caregiverRepository.update(id, updateCaregiverDto);
    return this.findOne(id);
  }

  async disable(id: number): Promise<Caregiver> {
    const caregiver = await this.findOne(id);
    caregiver.isActive = false;
    return await this.caregiverRepository.save(caregiver);
  }
}
