import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";

const app = getApps()[0] ?? initializeApp({});
const db = getFirestore(app);

let emulatorInitialized = false;
if (process.env.NODE_ENV !== "production" && !emulatorInitialized) {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  emulatorInitialized = true;
}

export { db };
