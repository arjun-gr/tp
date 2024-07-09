import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSanitaryPadServiceDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsString()
  serviceProductId: number;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  padBrand: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  installedQuantity: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  cost: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  totalCost: number;

  @ApiProperty({ type: Number, example: [] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  padAckInvoiceFileId: File[];

  @ApiProperty({ type: Number, example: [] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  padDeliveryChallanFileId: File[];

  @ApiProperty({ type: Number, example: [] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  padSignedReportCardFileId: File[];
}
