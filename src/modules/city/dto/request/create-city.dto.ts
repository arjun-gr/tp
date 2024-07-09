import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FranchiseModel } from '../../../../common/enums/franchise';
import { Tier } from '../../../../common/enums/tiers';
import { States } from '../../../../entities/states.entity';

export class CreateCityDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Number })
  state: States;

  @ApiProperty({ enum: Tier })
  tier: Tier;

  @ApiProperty({ enum: FranchiseModel })
  franchise: FranchiseModel;

  @ApiProperty({ type: Number })
  @IsOptional()
  cityOpsManager?: number;
}
