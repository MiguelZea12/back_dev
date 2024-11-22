import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/createPatient.dto';
import { UpdatePatientDto } from './dto/updatePatient.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    private readonly i18n: I18nService, // Inyección de I18nService
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<{ patient: Patient; message: string }> {
    const patient = this.patientsRepository.create(createPatientDto);
    try {
      const savedPatient = await this.patientsRepository.save(patient);
      const message = await this.i18n.translate('patients.success.created') as string;
      return { patient: savedPatient, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('patients.errors.create') as string;
      throw new InternalServerErrorException(errorMessage, error.message);
    }
  }

  async findAll(): Promise<{ patients: Patient[]; message: string }> {
    const patients = await this.patientsRepository.find();
    const message = await this.i18n.translate('patients.success.list') as string;
    return { patients, message };
  }

  async findOne(id: number): Promise<{ patient: Patient; message: string }> {
    const patient = await this.patientsRepository.findOne({ where: { id } });
    if (!patient) {
      const errorMessage = await this.i18n.translate('patients.errors.not_found', { args: { id } }) as string;
      throw new NotFoundException(errorMessage);
    }
    const message = await this.i18n.translate('patients.success.found') as string;
    return { patient, message };
  }

  async update(id: number, updatePatientDto: UpdatePatientDto): Promise<{ patient: Patient; message: string }> {
    const patient = await this.findOne(id).then((response) => response.patient);
    Object.assign(patient, updatePatientDto);

    try {
      const updatedPatient = await this.patientsRepository.save(patient);
      const message = await this.i18n.translate('patients.success.updated', { args: { id } }) as string;
      return { patient: updatedPatient, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('patients.errors.update', { args: { id } }) as string;
      throw new InternalServerErrorException(errorMessage, error.message);
    }
  }

  async disable(id: number): Promise<{ patient: Patient; message: string }> {
    const patient = await this.findOne(id).then((response) => response.patient);
    patient.status = false;

    try {
      const disabledPatient = await this.patientsRepository.save(patient);
      const message = await this.i18n.translate('patients.success.disabled', { args: { id } }) as string;
      return { patient: disabledPatient, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('patients.errors.disable', { args: { id } }) as string;
      throw new InternalServerErrorException(errorMessage, error.message);
    }
  }
}
