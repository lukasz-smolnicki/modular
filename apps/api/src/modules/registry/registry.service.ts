import { Inject, Injectable } from "@nestjs/common";
import { Firestore } from "@google-cloud/firestore";
import { FIRESTORE } from "../../database/firestore.module";
import { ModuleInfo } from "./types";

@Injectable()
export class RegistryService {
  constructor(@Inject(FIRESTORE) private readonly db: Firestore) {}

  async listPublic(): Promise<ModuleInfo[]> {
    const snap = await this.db
      .collection("modules")
      .where("public", "==", true)
      .get();
    return snap.docs.map((d) => {
      const data = d.data() as Partial<ModuleInfo>;
      return {
        key: data.key ?? d.id,
        name: data.name ?? d.id,
        route: data.route ?? `/${d.id}`,
        public: Boolean(data.public),
      };
    });
  }
}
