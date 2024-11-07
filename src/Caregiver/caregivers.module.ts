import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaregiversService } from './caregivers.service';
import { CaregiversController } from './caregivers.controller';
import { Caregiver } from './entitlies/caregiver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Caregiver])],
  controllers: [CaregiversController],
  providers: [CaregiversService],
  exports: [CaregiversService], // Exporta el servicio para que esté disponible en otros módulos si es necesario
})
export class CaregiversModule {}
