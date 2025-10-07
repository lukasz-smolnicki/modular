import { Firestore } from "@google-cloud/firestore";

export async function runSeed(db: Firestore) {
  await db.doc("health/firestore").set({ message: "Witamy z FIRESTORE" });
}
