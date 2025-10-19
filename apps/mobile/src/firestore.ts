import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getApps, getApp, initializeApp } from "firebase/app";

const app = getApps()[0] ?? initializeApp({});
const db = getFirestore(app);
if (process.env.NODE_ENV !== "production")
{
    try
    {
        connectFirestoreEmulator(db, "127.0.0.1", 8080);
    } catch { }
}
export { db };
