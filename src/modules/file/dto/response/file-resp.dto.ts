import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { File } from '../../../../entities/file.entity';

export class FileRespDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  url: string;

  constructor(file: File) {
    this.id = file.id;
    this.url = file.url;
  }
}
