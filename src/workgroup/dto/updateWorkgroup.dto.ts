import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkGroupDto } from './createWorkgroup.dto';

export class UpdateWorkGroupDto extends PartialType(CreateWorkGroupDto) {}
