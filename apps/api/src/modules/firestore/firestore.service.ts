import { Injectable } from "@nestjs/common";
import { FirebaseService } from "../../database/firebase.service";

const DOC_PATH = { collection: "config", doc: "messages" };
const FIELD = "welcome";
const DEFAULT_TEXT = "Witam z FIREBASE";

@Injectable()
export class FirestoreMsgService {
  constructor(private readonly fb: FirebaseService) {}

  async getWelcome(): Promise<string> {
    const ref = this.fb.db.collection(DOC_PATH.collection).doc(DOC_PATH.doc);
    const snap = await ref.get();

    if (!snap.exists || !snap.get(FIELD)) {
      await ref.set({ [FIELD]: DEFAULT_TEXT }, { merge: true });
      return DEFAULT_TEXT;
    }
    return String(snap.get(FIELD));
  }
}
