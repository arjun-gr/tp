import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateFemaleHygieneUnitDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsString()
  productId: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  serviceType: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  serviceCost: number;
}
