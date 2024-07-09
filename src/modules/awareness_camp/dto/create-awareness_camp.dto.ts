import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { AwarenessCampStatus } from '../../../common/enums/awareness-camp';

export class CreateAwarenessCampDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  clientId: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  branchId: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  cityId: number;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  type: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g)
  email: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  phoneNumber: string;

  @ApiProperty({ type: Number, default: 0 })
  noOfEmployee: number;

  @ApiProperty({ type: Date })
  eventDate: Date;

  @ApiProperty({ enum: AwarenessCampStatus })
  status: AwarenessCampStatus;
}
