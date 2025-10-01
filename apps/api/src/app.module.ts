import { Module } from "@nestjs/common";
import { ApiController } from "./controllers/api.controller";
import { FirestoreController } from "./controllers/firestore.controller";

@Module({ controllers: [ApiController, FirestoreController] })
export class AppModule {}
