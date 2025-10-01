import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class ApiController {
  @Get()
  getRoot(): string {
    return 'Witam z API';
  }
}
