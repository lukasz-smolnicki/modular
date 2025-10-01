import { Injectable } from "@nestjs/common";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let inited = false;

@Injectable()
export class FirebaseService {
  public readonly db: Firestore;

  constructor() {
    if (!inited) {
      initializeApp({ projectId: "demo-test" });
      inited = true;
    }
    this.db = getFirestore();
  }
}
