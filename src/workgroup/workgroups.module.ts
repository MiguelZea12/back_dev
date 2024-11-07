import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkGroupsService } from './workgroups.service';
import { WorkGroupsController } from './workgroups.controller';
import { WorkGroup } from './entities/workgroup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkGroup])],
  controllers: [WorkGroupsController],
  providers: [WorkGroupsService],
  exports: [WorkGroupsService],
})
export class WorkGroupsModule {}
