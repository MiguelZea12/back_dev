import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { Team } from './entities/team.entity';
import { WorkGroup } from '@/workgroup/entities/workgroup.entity';
import { I18nModule } from 'nestjs-i18n'; // Importa I18nModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, WorkGroup]), // Registra las entidades
    I18nModule, // Importa I18nModule para que esté disponible
  ],
  controllers: [TeamsController],
  providers: [TeamsService ,I18nModule],
  exports: [TeamsService],
})
export class TeamsModule {}
