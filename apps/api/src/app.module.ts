import { Module } from "@nestjs/common";
import { ApiModule } from "./modules/api/api.module";
import { FirestoreModule } from "./modules/firestore/firestore.module";
import { FirebaseModule } from "./database/firebase.module";

@Module({
  imports: [FirebaseModule, ApiModule, FirestoreModule],
})
export class AppModule {}
