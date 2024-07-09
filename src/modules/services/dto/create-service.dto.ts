import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { File } from '../../../entities/file.entity';
import { CreateAgentsDto } from './create-agent.dto';
import { FemaleHygieneUnitInstallDto } from './fhu-installation.dto';
import { CreateSanitaryPadServiceDto } from './sanitary-pad-service.dto';
import { CreateSimCardServiceDto } from './sim-card-service.dto';
import { VendingMachineInstallDto } from './vm-installation.dto';

export class CreateServiceDto {
  // @ApiProperty({ type: Number })
  // @Type(() => Number)
  // @IsInt()
  // userId: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  clientId: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  cityId: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  branchId: number;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  type: string;

  @ApiProperty({ type: Date, example: '2024-03-30' })
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ type: Date, example: '2024-03-30' })
  @IsNotEmpty()
  actualServiceDate: Date;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  purchaseId: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  FhubinQuantity: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  FhuinvoiceAmount: number;

  @ApiProperty({ type: Number, example: [1, 2] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  fhuSignedReportCardFileId: File[];

  @ApiProperty({ type: Number, example: [1, 2] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  fhuSignedServiceCardFileId: File[];

  @ApiProperty({ type: Number, example: [1, 2] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  fhuAckInvoiceFileId: File[];

  @ApiProperty({ type: [CreateAgentsDto] })
  @IsArray()
  @IsDefined()
  @IsOptional()
  agents: CreateAgentsDto[];

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  vmServiceType: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  vmQuantity: number;

  @ApiProperty({ type: Number, example: [1, 2] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  vmSignedServiceCardFileId: File[];

  @ApiProperty({ type: Number, example: [1, 2] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  vmAckInvoiceFileId: File[];

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

  @ApiProperty({ type: Number, example: [1, 2] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  signedAckInvoiceFileId: File[];

  @ApiProperty({ type: Number, example: [1, 2] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  ackDeliveryChallanFileId: File[];

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  wastePadCollection: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  padSoldInvoiceAmount: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  totalServiceCost: number;

  @ApiProperty({ type: [FemaleHygieneUnitInstallDto] })
  @IsArray()
  @IsDefined()
  @IsOptional()
  femaleHygieneUnit: FemaleHygieneUnitInstallDto[];

  @ApiProperty({ type: [VendingMachineInstallDto] })
  @IsArray()
  @IsDefined()
  @IsOptional()
  vendingMachine: VendingMachineInstallDto[];

  @ApiProperty({ type: [CreateSimCardServiceDto] })
  @IsArray()
  @ValidateNested()
  @IsDefined()
  @IsOptional()
  simCard: CreateSimCardServiceDto[];

  @ApiProperty({ type: [CreateSanitaryPadServiceDto] })
  @IsArray()
  @ValidateNested()
  @IsDefined()
  @IsOptional()
  vmPads: CreateSanitaryPadServiceDto[];

  @ApiProperty({ type: [CreateSanitaryPadServiceDto] })
  @IsArray()
  @ValidateNested()
  @IsDefined()
  @IsOptional()
  sanitaryPads: CreateSanitaryPadServiceDto[];

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  rating: number;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  clientOnboardingProduct: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  stickers: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsOptional()
  @IsString()
  reason: string;

  @ApiProperty({ type: Date })
  @IsOptional()
  rescheduleDate: Date;

  @ApiProperty({ type: Number, example: [1, 2] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  introMailFromSalesTeamFileId: File[];

  @ApiProperty({ type: Number, example: [1, 2] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  ackMailFromOpsTeamFileId: File[];

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
  @IsString()
  @IsOptional()
  vehicleUsed: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  otherVehicleDetails: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  binMaintenancePart: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  otherBinMaintenancePart: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  binMaintenancePartQty: number;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsOptional()
  @IsString()
  cancelledReason: string;

  @ApiProperty({ type: Date })
  @IsOptional()
  cancelledAt: Date;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsOptional()
  serviceInvoiceAmount: number;

  @ApiProperty({ type: Date })
  @IsOptional()
  completedAt: Date;  
}
