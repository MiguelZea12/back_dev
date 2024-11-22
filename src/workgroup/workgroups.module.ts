import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n'; // Importar el módulo de internacionalización
import { WorkGroupsService } from './workgroups.service';
import { WorkGroupsController } from './workgroups.controller';
import { WorkGroup } from './entities/workgroup.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkGroup]),
    I18nModule, // Incluir el módulo de internacionalización
  ],
  controllers: [WorkGroupsController],
  providers: [WorkGroupsService,I18nModule],
  exports: [WorkGroupsService],
})
export class WorkGroupsModule {}
