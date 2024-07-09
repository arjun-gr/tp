import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, isNumber } from 'class-validator';
import { VM_SERVICE_TYPE } from 'src/common/enums/client';

export class CreateVendingMachineDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  readonly branchProductId: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsString()
  productId: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  quantity: number = null;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  serviceType: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsEnum(VM_SERVICE_TYPE)
  @IsOptional()
  deploymentType: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  rentalAmount: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  buyoutAmount: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  refillingQuantity: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  refillingAmount: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  totalServiceCost: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  serviceCost: number = null;

  //=======================================================//

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  installedQuantity: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  servicedQuantity: number;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  machineNumber: string= null;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  vmMaintenanceParts: string = null;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  vmMaintenancePartOther: string = null;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  vmMaintenancePartQty: string = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  invoiceAmount: number = null;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsNumber()
  @IsOptional()
  invoiceNumber: string = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  padRefillingQuantity5Rs: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  padRefillingQuantity10Rs: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  coinRefillingCollection5Rs: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  coinRefillingCollection10Rs: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  padSoldQuantity5Rs: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  padSoldQuantity10Rs: number = null;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  padSoldInvAmount: number = null;
}
