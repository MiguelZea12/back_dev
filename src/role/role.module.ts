import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from '@/role/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n'; // Importa I18nModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]), // Registra la entidad Role
    I18nModule, // Importa I18nModule para habilitar traducciones
  ],
  providers: [RoleService,I18nModule],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
