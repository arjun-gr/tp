import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, isNumber } from 'class-validator';

export class CreateSanitaryPadDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  branchProductId: number = null;

  @ApiProperty({ type: String })
  @Type(() => String)
  @Transform((param) => (param.value == '' ? null : param.value))
  @IsString()
  padBrand: string = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  quantity: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  cost: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  totalCost: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  installedQuantity: number = null;
}
