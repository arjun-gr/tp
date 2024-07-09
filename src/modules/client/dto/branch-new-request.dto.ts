import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { ContractType } from '../../../common/enums/contract';
import { AddBranchDto } from './add-branch.dto';

export class BranchContractRequestDto extends PartialType(AddBranchDto) {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  clientId: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  branchId: number;

  @ApiProperty({ type: [Number] })
  @Type(() => Number)
  // @IsNumber({}, { each: true })
  @IsOptional()
  purchaseIds: number[];

  @ApiProperty({ enum: ContractType })
  @Type(() => String)
  @IsString()
  @IsOptional()
  requestType: string;
}
