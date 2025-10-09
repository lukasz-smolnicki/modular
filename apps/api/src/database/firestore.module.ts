import { Module, Provider } from "@nestjs/common";
import { Firestore } from "@google-cloud/firestore";
import { runSeed } from "./firestore.seed";

export const FIRESTORE = Symbol("FIRESTORE");

const firestoreProvider: Provider<Firestore> = {
  provide: FIRESTORE,
  useFactory: async (): Promise<Firestore> => {
    const projectId =
      process.env.FIREBASE_PROJECT_ID ||
      process.env.GCLOUD_PROJECT ||
      "local-project";

    const databaseId = process.env.FIRESTORE_DATABASE_ID || "(default)";
    const emulator = process.env.FIRESTORE_EMULATOR_HOST;

    let db: Firestore;

    if (emulator) {
      const [host, portStr] = emulator.split(":");
      const settings: ConstructorParameters<typeof Firestore>[0] = {
        projectId,
        host,
        port: Number(portStr),
        ssl: false,
        databaseId,
      };
      db = new Firestore(settings);
    } else {
      db = new Firestore({ projectId, databaseId });
    }

    const shouldSeed =
      (process.env.FIRESTORE_SEED_ON_START ?? "false") === "true";
    if (shouldSeed) {
      await runSeed(db);
    }

    return db;
  },
};

@Module({
  providers: [firestoreProvider],
  exports: [firestoreProvider],
})
export class FirestoreModule {}
