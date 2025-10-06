import { Inject, Injectable } from "@nestjs/common";
import { Firestore } from "@google-cloud/firestore";
import { FIRESTORE } from "./firestore.module";

@Injectable()
export class FirestoreService {
  constructor(@Inject(FIRESTORE) private readonly db: Firestore) {}
}
