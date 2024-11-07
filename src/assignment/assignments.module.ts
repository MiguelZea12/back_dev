import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { Assignment } from './entities/assignment.entity';
import { User } from '@/user/user.entity';
import { Team } from '@/team/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, User, Team])],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
})
export class AssignmentsModule {}
