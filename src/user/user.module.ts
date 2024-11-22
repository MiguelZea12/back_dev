import { Module } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { UserController } from '@/user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/user/user.entity';
import { Role } from '@/role/role.entity';
import { RoleService } from '@/role/role.service';
import { I18nModule } from 'nestjs-i18n'; // Importar I18nModule

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    I18nModule, // Incluir el módulo de internacionalización
  ],
  providers: [UserService, RoleService, I18nModule],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
