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
import { CreateSPOCDto } from './create-spoc.dto';
import { CreateFemaleHygieneUnitDto } from './female-hygiene-unit.dto';
import { CreateSanitaryPadDto } from './sanitary-pad.dto';
import { CreateSimCardDto } from './sim-card.dto';
import { CreateVendingMachineDto } from './vending-machine.dto';

export class AddBranchDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  clientId: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  branchId: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  city: number;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  branchName: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  billingAddress: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  siteAddress: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  pincode: number;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  gstNumber: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  soNumber: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  poNumber: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsOptional()
  paymentTerms: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsOptional()
  billingFaq: string;

  @ApiProperty({ type: Date, example: '2024-03-30' })
  @IsOptional()
  soReceivedDate: Date;

  @ApiProperty({ type: Date, example: '2024-03-30' })
  @IsOptional()
  contractStartDate: Date;

  @ApiProperty({ type: Date, example: '2024-03-30' })
  @IsOptional()
  contractEndDate: Date;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  femaleCount: number;

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

  @ApiProperty({ type: [CreateSPOCDto] })
  @IsArray()
  @ValidateNested()
  @IsDefined()
  spoc: CreateSPOCDto[];

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  salesLead: string;

  @ApiProperty({ type: Number, example: [1, 2] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  purchaseOrderFileId: File[];

  @ApiProperty({ type: Number, example: [1, 2] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  salesOrderFileId: File[];

  @ApiProperty({ type: Number, example: [1, 2] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  agreementFileId: File[];

  @ApiProperty({ type: Number, example: [1, 2] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  workAuthorizationLetterFileId: File[];

  @ApiProperty({ type: Number, example: [1, 2] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  emailConfirmationFileId: File[];
}
