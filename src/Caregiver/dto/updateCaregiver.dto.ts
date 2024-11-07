import { PartialType } from '@nestjs/mapped-types';
import { CreateCaregiverDto } from './createCaregiver.dto';

export class UpdateCaregiverDto extends PartialType(CreateCaregiverDto) {}
