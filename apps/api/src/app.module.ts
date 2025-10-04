import { Module } from '@nestjs/common';
import { FirestoreModule } from './database/firestore.module';
import { HealthModule } from './modules/health/health.module';

@Module({
    imports: [FirestoreModule, HealthModule]
})
export class AppModule {}
