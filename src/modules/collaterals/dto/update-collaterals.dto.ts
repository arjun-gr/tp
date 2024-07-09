import { PartialType } from '@nestjs/mapped-types';
import { CreateCollateralsDto } from './create-collaterals.dto';

export class UpdateCollateralsDto extends PartialType(CreateCollateralsDto) {}
