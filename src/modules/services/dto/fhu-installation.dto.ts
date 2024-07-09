import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class FemaleHygieneUnitInstallDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsString()
  @IsOptional()
  serviceProductId: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsString()
  productId: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  quantity: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  installedQuantity: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  servicedQuantity: number;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  serviceType: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  invoiceAmount: number;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  isInvoiceSubmitted: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  invoiceOther: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsOptional()
  invoiceNumber: string;

  @ApiProperty({ type: Number, example: [] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  fhuSignedReportCardFileId: File[];

  @ApiProperty({ type: Number, example: [] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  fhuDeliveryChallanFileId: File[];

  @ApiProperty({ type: Number, example: [] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  fhuAckInvoiceFileId: File[];
}
