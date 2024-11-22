import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patient } from './entities/patient.entity';
import { I18nModule } from 'nestjs-i18n'; // Importa I18nModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]), // Registra la entidad Patient
    I18nModule, // Importa I18nModule para habilitar traducciones
  ],
  controllers: [PatientsController],
  providers: [PatientsService, I18nModule],
  exports: [PatientsService],
})
export class PatientsModule {}
