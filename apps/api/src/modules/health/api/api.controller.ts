import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller()
export class ApiController {
    constructor(private readonly svc: ApiService) {}

    @Get()
    hello() {
        return { message: this.svc.getMessage() };
    }
}
