import { Module } from "@nestjs/common";
import { FirestoreController } from "./firestore.controller";
// Jeśli FirebaseModule NIE jest @Global(), odkomentuj import i dodaj do imports:
// import { FirebaseModule } from '../../database/firebase/firebase.module';

@Module({
  // imports: [FirebaseModule],
  controllers: [FirestoreController],
})
export class FirestoreModule {}
