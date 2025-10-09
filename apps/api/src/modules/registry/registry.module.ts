import { Module } from '@nestjs/common';
import { RegistryController } from './registry.controller';
import { RegistryService } from './registry.service';
import { FirestoreModule as DbFirestoreModule } from '../../database/firestore.module';

@Module({
    imports: [DbFirestoreModule],
    controllers: [RegistryController],
    providers: [RegistryService]
})
export class RegistryModule {}
