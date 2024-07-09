import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Branch } from '../../../entities/branch.entity';
import { City } from '../../../entities/city.entity';
import { Clients } from '../../../entities/clients.entity';
import { Purchase } from '../../../entities/purchase.entity';
import { User } from '../../../entities/user.entity';
import { CreateFemaleHygieneUnitDto } from '../../client/dto/female-hygiene-unit.dto';
import { CreateSanitaryPadDto } from '../../client/dto/sanitary-pad.dto';
import { CreateSimCardDto } from '../../client/dto/sim-card.dto';
import { CreateVendingMachineDto } from '../../client/dto/vending-machine.dto';

export class CreateMaintenanceServiceDto {
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

  @ApiProperty({ type: Date, example: '2024-03-30' })
  @IsNotEmpty()
  completedAt: Date;

  @ApiProperty({ type: Number })
  @Type(() => Purchase)
  @IsInt()
  @IsOptional()
  purchase: Purchase;

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

  @ApiProperty({ type: [CreateFemaleHygieneUnitDto] })
  @IsArray()
  @ValidateNested()
  @IsDefined()
  @IsOptional()
  femaleHygieneUnit: CreateFemaleHygieneUnitDto[];

  @ApiProperty({ type: [CreateVendingMachineDto] })
  @IsArray()
  @ValidateNested()
  @IsDefined()
  @IsOptional()
  vendingMachine: CreateVendingMachineDto[];

  @ApiProperty({ type: [CreateSimCardDto] })
  @IsArray()
  @ValidateNested()
  @IsDefined()
  @IsOptional()
  simRecharge: CreateSimCardDto[];

  @ApiProperty({ type: [CreateSanitaryPadDto] })
  @IsArray()
  @ValidateNested()
  @IsDefined()
  @IsOptional()
  sanitaryPads: CreateSanitaryPadDto[];

  @ApiProperty({ type: [CreateSanitaryPadDto] })
  @IsArray()
  @ValidateNested()
  @IsDefined()
  @IsOptional()
  vmPads: CreateSanitaryPadDto[];

  @ApiProperty({ type: [CreateSanitaryPadDto] })
  @IsArray()
  @ValidateNested()
  @IsDefined()
  @IsOptional()
  vmProducts: CreateSanitaryPadDto[];
}
