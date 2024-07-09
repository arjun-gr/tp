import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class VendingMachineInstallDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsString()
  @IsOptional()
  serviceProductId: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsString()
  @IsOptional()
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
  deploymentType: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  serviceType: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  machineNumber: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  vmMaintenanceParts: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  vmMaintenancePartOther: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsOptional()
  vmMaintenancePartQty: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  invoiceAmount: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  padRefillingQuantity5Rs: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  padRefillingQuantity10Rs: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  coinRefillingCollection5Rs: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  coinRefillingCollection10Rs: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  padSoldQuantity5Rs: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  padSoldQuantity10Rs: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  padSoldInvAmount: number;

  @ApiProperty({ type: Number, example: [] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  vmSalesOrder: File[];

  @ApiProperty({ type: Number, example: [] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  vmAckInvoiceFileId: File[];

  @ApiProperty({ type: Number, example: [] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  vmDeliveryChallanFileId: File[];

  @ApiProperty({ type: Number, example: [] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  vmSignedReportCardFileId: File[];

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  refillingQuantity: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  refillingAmount: number;
}
