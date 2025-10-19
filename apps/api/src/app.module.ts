import { Module } from "@nestjs/common";
import { FirestoreModule } from "./database/firestore.module";
import { HealthModule } from "./modules/health/health.module";
import { RegistryModule } from "./modules/registry/registry.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [FirestoreModule, HealthModule, RegistryModule, UsersModule],
})
export class AppModule {}
