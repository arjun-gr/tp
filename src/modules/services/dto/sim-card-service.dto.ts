import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, isNumber } from 'class-validator';

export class CreateSimCardServiceDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  serviceProductId: number = null;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  simBrand: string = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  price: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  quantity: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  installedQuantity: number = null;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  simNumber: string = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  totalAmount: number = null;
}
