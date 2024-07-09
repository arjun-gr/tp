import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
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

export class CreatePartialServiceDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  user: User;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  client: Clients;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  city: City;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  branch: Branch;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  purchase: Purchase;

  @ApiProperty({ type: [Date], example: ['2024-03-30'] })
  @IsNotEmpty()
  date: Date[];

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
}
