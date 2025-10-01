import { Module } from "@nestjs/common";
import { FirestoreController } from "./firestore.controller";
import { FirestoreMsgService } from "./firestore.service";

@Module({
  controllers: [FirestoreController],
  providers: [FirestoreMsgService],
})
export class FirestoreModule {}
