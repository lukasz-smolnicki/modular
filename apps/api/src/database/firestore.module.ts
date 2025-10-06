import { Module, Provider } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { runSeed } from './firestore.seed';

export const FIRESTORE = Symbol('FIRESTORE');

const firestoreProvider: Provider<Firestore> = {
    provide: FIRESTORE,
    useFactory: async (): Promise<Firestore> => {
        const emulator = process.env.FIRESTORE_EMULATOR_HOST;

        if (emulator) {
            const [host, portStr] = emulator.split(':');
            const projectId =
                process.env.FIREBASE_PROJECT_ID ||
                process.env.GOOGLE_CLOUD_PROJECT ||
                process.env.GCLOUD_PROJECT ||
                'local-project';

            const db = new Firestore({
                projectId,
                host,
                port: Number(portStr),
                ssl: false
            });

            if ((process.env.FIRESTORE_SEED_ON_START ?? 'true') === 'true') {
                await runSeed(db);
            }

            return db;
        }

        const db = new Firestore();
        return db;
    }
};

@Module({
    providers: [firestoreProvider],
    exports: [firestoreProvider]
})
export class FirestoreModule {}
