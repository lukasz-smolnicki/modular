import { Controller, Get } from "@nestjs/common";
import { FirebaseService } from "../../database/firebase.service";

@Controller("firestore")
export class FirestoreController {
  constructor(private readonly fb: FirebaseService) {}

  @Get()
  async get(): Promise<string> {
    const ref = this.fb.db.collection("health").doc("ping");
    await ref.set({ ok: true, ts: Date.now() }, { merge: true });
    return "Firestore OK";
  }
}
