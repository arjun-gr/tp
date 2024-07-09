import { PartialType } from '@nestjs/mapped-types';
import { CreateAwarenessCampDto } from './create-awareness_camp.dto';

export class UpdateAwarenessCampDto extends PartialType(CreateAwarenessCampDto) {}
