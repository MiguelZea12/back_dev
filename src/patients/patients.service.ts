import { Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly i18n: I18nService,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientsRepository.create(createPatientDto);
    const savedPatient = await this.patientsRepository.save(patient);
    console.log(await this.i18n.t('patient.patient_created'));
    return savedPatient;
  }

  async findAll(): Promise<Patient[]> {
    const patients = await this.patientsRepository.find();
    console.log(await this.i18n.t('patient.patients_list'));
    return patients;
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({ where: { id } });
    if (!patient) {
      const errorMsg = await this.i18n.t('patient.error_patient_not_found', {
        args: { id },
      });
      throw new NotFoundException(errorMsg);
    }
    return patient;
  }

  async update(
    id: number,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    const patient = await this.findOne(id);
    Object.assign(patient, updatePatientDto);
    const updatedPatient = await this.patientsRepository.save(patient);
    console.log(await this.i18n.t('patient.patient_updated'));
    return updatedPatient;
  }

  async disable(id: number): Promise<Patient> {
    const patient = await this.findOne(id);
    patient.status = false;
    const disabledPatient = await this.patientsRepository.save(patient);
    console.log(await this.i18n.t('patient.patient_disabled'));
    return disabledPatient;
  }
}
