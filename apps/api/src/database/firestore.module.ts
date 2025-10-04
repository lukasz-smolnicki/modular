import { Module, Provider } from "@nestjs/common";
import { Firestore } from "@google-cloud/firestore";
import { runSeed } from "./firestore.seed";

export const FIRESTORE = Symbol("FIRESTORE");

const firestoreProvider: Provider = {
  provide: FIRESTORE,
  useFactory: async () => {
    const projectId =
      process.env.FIREBASE_PROJECT_ID ||
      process.env.GCLOUD_PROJECT ||
      "local-project";

    const emulator = process.env.FIRESTORE_EMULATOR_HOST;
    let db: Firestore;

    if (emulator) {
      const [host, portStr] = emulator.split(":");
      db = new Firestore({
        projectId,
        host,
        port: Number(portStr),
        ssl: false,
      } as any);
      if ((process.env.FIRESTORE_SEED_ON_START ?? "true") === "true") {
        await runSeed(db);
      }
    } else {
      db = new Firestore({ projectId });
    }
    return db;
  },
};

@Module({
  providers: [firestoreProvider],
  exports: [firestoreProvider],
})
export class FirestoreModule {}
