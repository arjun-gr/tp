import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
import { City } from '../../../entities/city.entity';
import { File } from '../../../entities/file.entity';
import { CreateSPOCDto } from './create-spoc.dto';
import { CreateFemaleHygieneUnitDto } from './female-hygiene-unit.dto';
import { CreateVendingMachineDto } from './vending-machine.dto';

export class CreateClientDto {
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
  logoId: File;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  clientType: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  entryType: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  creationType: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  city: City;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  branchName: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  billingAddress: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  siteAddress: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  pincode: number;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  gstNumber: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  soNumber: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  poNumber: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  paymentTerms: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  billingFaq: string;

  @ApiPropertyOptional({ type: Date })
  @IsNotEmpty()
  soReceivedDate: Date;

  @ApiPropertyOptional({ type: Date })
  @IsNotEmpty()
  contractStartDate: Date;

  @ApiPropertyOptional({ type: Date })
  @IsNotEmpty()
  contractEndDate: Date;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  femaleCount: number;

  @ApiProperty({ type: [CreateFemaleHygieneUnitDto] })
  @IsArray()
  @ValidateNested()
  @IsDefined()
  femaleHygieneUnit: CreateFemaleHygieneUnitDto[];

  @ApiProperty({ type: [CreateVendingMachineDto] })
  @IsArray()
  @ValidateNested()
  @IsDefined()
  vendingMachine: CreateVendingMachineDto[];

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
