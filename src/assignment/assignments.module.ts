import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { Assignment } from './entities/assignment.entity';
import { User } from '@/user/user.entity';
import { Team } from '@/team/entities/team.entity';
import { I18nModule } from 'nestjs-i18n'; // Importa I18nModule para soporte de traducciones

@Module({
  imports: [
    TypeOrmModule.forFeature([Assignment, User, Team]), // Registra las entidades
    I18nModule, // Agrega I18nModule para habilitar traducciones
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService, I18nModule],
  exports: [AssignmentsService], // Exporta el servicio si es necesario para otros módulos
})
export class AssignmentsModule {}
