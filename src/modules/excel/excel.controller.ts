import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/jwt-auth.guard';
import { ExcelService } from './excel.service';

@Controller('excel')
@ApiTags('excel')
@Public()
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post()
  create() {
    return this.excelService.createServices();
  }

  @Post("clients")
  createClients(){
    return this.excelService.create()
  }
}
