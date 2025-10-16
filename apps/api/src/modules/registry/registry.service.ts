import { Inject, Injectable } from "@nestjs/common";
import { Firestore } from "@google-cloud/firestore";
import { FIRESTORE } from "../../database/firestore.module";
import type { Core, Modules } from "@modular/types";

@Injectable()
export class RegistryService {
  constructor(@Inject(FIRESTORE) private readonly db: Firestore) {}

  async listPublic(): Promise<Modules.ModuleInfo[]> {
    const snap = await this.db
      .collection("modules")
      .where("public", "==", true)
      .get();

    return snap.docs.map((d) => {
      const data = d.data() as Partial<Modules.ModuleInfo> & {
        key?: Core.ModuleKey;
      };
      const key = data.key ?? (d.id as Core.ModuleKey);
      return {
        key,
        name: data.name ?? d.id,
        route: data.route ?? `/${d.id}`,
        public: Boolean(data.public),
      };
    });
  }
}
