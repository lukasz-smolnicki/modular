import { Controller, Get } from '@nestjs/common';
import { RegistryService } from './registry.service';
import type { ModuleInfo } from './types';

@Controller('modules/registry')
export class RegistryController {
    constructor(private readonly svc: RegistryService) {}

    @Get('public')
    async listPublic(): Promise<ModuleInfo[]> {
        return this.svc.listPublic();
    }
}
