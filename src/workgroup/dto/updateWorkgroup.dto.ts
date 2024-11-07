import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkGroupDto } from './create-workgroup.dto';

export class UpdateWorkGroupDto extends PartialType(CreateWorkGroupDto) {}
