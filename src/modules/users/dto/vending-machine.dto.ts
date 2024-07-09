import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateVendingMachineDto {
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
  @IsNumber()
  rentalAmount: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  buyoutAmount: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  refillingQuantity: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  refillingAmount: number;
}
