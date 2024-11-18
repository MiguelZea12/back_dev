import { Controller, Get, Post, Body, Param, Put, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { I18nService } from 'nestjs-i18n';
import { CreatePatientDto } from './dto/createPatient.dto';
import { UpdatePatientDto } from './dto/updatePatient.dto';

@Controller('patients')
export class PatientsController {
  private readonly logger = new Logger(PatientsController.name);

  constructor(
    private readonly patientsService: PatientsService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto) {
    const logMessage = await this.i18n.translate('patient.creating_patient') as string;
    this.logger.log(logMessage);

    try {
      const patient = await this.patientsService.create(createPatientDto);
      const message = await this.i18n.translate('patient.patient_created') as string;
      return { patient, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('patient.error_creating_patient') as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    const logMessage = await this.i18n.translate('patient.fetching_all_patients') as string;
    this.logger.log(logMessage);

    try {
      const patients = await this.patientsService.findAll();
      const message = await this.i18n.translate('patient.patients_list') as string;
      return { patients, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('patient.error_fetching_patients') as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const logMessage = await this.i18n.translate('patient.finding_patient_by_id', { args: { id } }) as string;
    this.logger.log(logMessage);

    try {
      const patient = await this.patientsService.findOne(id);
      const message = await this.i18n.translate('patient.patient_found') as string;
      return { patient, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('patient.error_patient_not_found', { args: { id } }) as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updatePatientDto: UpdatePatientDto) {
    const logMessage = await this.i18n.translate('patient.updating_patient', { args: { id } }) as string;
    this.logger.log(logMessage);

    try {
      const updatedPatient = await this.patientsService.update(id, updatePatientDto);
      const message = await this.i18n.translate('patient.patient_updated', { args: { id } }) as string;
      return { patient: updatedPatient, message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('patient.error_updating_patient', { args: { id } }) as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('disable/:id')
  async disable(@Param('id') id: number) {
    const logMessage = await this.i18n.translate('patient.disabling_patient', { args: { id } }) as string;
    this.logger.log(logMessage);

    try {
      await this.patientsService.disable(id);
      const message = await this.i18n.translate('patient.patient_disabled', { args: { id } }) as string;
      return { message };
    } catch (error) {
      const errorMessage = await this.i18n.translate('patient.error_disabling_patient', { args: { id } }) as string;
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
