import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  isNumber,
  isString,
} from 'class-validator';

export class CreateSimCardDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  branchProductId: number = null;

  @ApiProperty({ type: String })
  @Type(() => String)
  @Transform((param) => (param.value == '' ? null : param.value))
  @IsString()
  @IsOptional()
  simBrand: string = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  quantity: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  price: number = null;

  @ApiProperty({ type: String })
  @Type(() => String)
  @Transform((param) => (param.value == '' ? null : param.value))
  @IsString()
  simNumber: string = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  totalAmount: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  installedQuantity: number = null;
}
