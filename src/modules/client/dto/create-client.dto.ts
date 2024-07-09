import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ContractType } from '../../../common/enums/contract';
import { File } from '../../../entities/file.entity';
import { AddBranchDto } from './add-branch.dto';
import { CreateSPOCDto } from './create-spoc.dto';
import { CreateFemaleHygieneUnitDto } from './female-hygiene-unit.dto';
import { CreateSanitaryPadDto } from './sanitary-pad.dto';
import { CreateSimCardDto } from './sim-card.dto';
import { CreateVendingMachineDto } from './vending-machine.dto';

export class CreateClientDto extends AddBranchDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  clientId: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  branchId: number;

  @ApiProperty({ enum: ContractType })
  @Type(() => String)
  @IsString()
  @IsOptional()
  requestType: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  userType: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  logoId: File;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  clientType: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  industryType: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  IFMClientId: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
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
  @IsString()
  @IsOptional()
  paymentTerms: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
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

  @ApiProperty({ type: [CreateSPOCDto] })
  @IsArray()
  @ValidateNested()
  @IsDefined()
  @IsOptional()
  spoc: CreateSPOCDto[];

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

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
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

  @ApiProperty({ type: Date, example: '2024-03-30' })
  @IsOptional()
  installationDate: Date;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  Email: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  Password: string;w

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  userName: string;

  @ApiProperty({ type: Date, example: '2024-03-30' })
  @IsOptional()
  completedAt: Date;
}
