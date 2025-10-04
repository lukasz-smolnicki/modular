import { Controller, Get } from '@nestjs/common';
import { FirestoreHealthService } from './firestore.service';

@Controller()
export class FirestoreController {
    constructor(private readonly svc: FirestoreHealthService) {}

    @Get()
    async hello() {
        const message = await this.svc.getMessage();
        return { message };
    }
}
