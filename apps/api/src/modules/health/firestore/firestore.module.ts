import { Module } from '@nestjs/common';
import { FirestoreController } from './firestore.controller';
import { FirestoreHealthService } from './firestore.service';
import { FirestoreModule as DbFirestoreModule } from '../../../database/firestore.module';

@Module({
    imports: [DbFirestoreModule],
    controllers: [FirestoreController],
    providers: [FirestoreHealthService]
})
export class HealthFirestoreModule {}
