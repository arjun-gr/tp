import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Matches } from 'class-validator';

export class SetPasswordDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({ type: String })
  @Type(() => String)
  @Matches(/^[a-z0-9_.]+$/g, {
    message: 'username can only contain letters of the alphabet, . and -',
  })
  @IsString()
  userName: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g)
  email: string;

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsString()
  @IsOptional()
  password: string;
}
