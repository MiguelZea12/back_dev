import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamDto } from './createTeam.dto';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {}
