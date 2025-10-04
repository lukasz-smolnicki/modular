import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { HealthApiModule } from './api/api.module';
import { HealthFirestoreModule } from './firestore/firestore.module';

@Module({
    imports: [
        HealthApiModule,
        HealthFirestoreModule,
        RouterModule.register([
            {
                path: 'health',
                children: [
                    { path: 'api', module: HealthApiModule },
                    { path: 'firestore', module: HealthFirestoreModule }
                ]
            }
        ])
    ]
})
export class HealthModule {}
