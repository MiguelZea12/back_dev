import { Controller, Get, Post, Put, Param, Body, Delete } from '@nestjs/common';
import { CaregiversService } from './caregivers.service';
import { CreateCaregiverDto } from './dto/createCaregiver.dto';
import { UpdateCaregiverDto } from './dto/updateCaregiver.dto';
import { Caregiver } from './entitlies/caregiver.entity';

@Controller('caregivers')
export class CaregiversController {
  constructor(private readonly caregiversService: CaregiversService) {}

  @Get()
  async findAll(): Promise<Caregiver[]> {
    return await this.caregiversService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Caregiver> {
    return await this.caregiversService.findOne(id);
  }

  @Post()
  async create(@Body() createCaregiverDto: CreateCaregiverDto): Promise<Caregiver> {
    return await this.caregiversService.create(createCaregiverDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCaregiverDto: UpdateCaregiverDto,
  ): Promise<Caregiver> {
    return await this.caregiversService.update(id, updateCaregiverDto);
  }

  @Delete(':id')
  async disable(@Param('id') id: number): Promise<Caregiver> {
    return await this.caregiversService.disable(id);
  }
}
