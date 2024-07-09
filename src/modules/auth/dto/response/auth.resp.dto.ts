import { ApiProperty } from '@nestjs/swagger';

export class AuthRespDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  access_token: string;

  constructor(id: number, accessToken: string) {
    this.id = id;
    this.access_token = accessToken;
  }
}
