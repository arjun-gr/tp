import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUserLoginDto {
  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  userName: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly clientId: number;
}
