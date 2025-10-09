import { Module } from "@nestjs/common";
import { FirestoreModule } from "./database/firestore.module";
import { HealthModule } from "./modules/health/health.module";
import { RegistryModule } from "./modules/registry/registry.module";

@Module({
  imports: [FirestoreModule, HealthModule, RegistryModule],
})
export class AppModule {}
