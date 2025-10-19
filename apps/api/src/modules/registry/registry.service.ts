import { Inject, Injectable } from "@nestjs/common";
import { Firestore } from "@google-cloud/firestore";
import { FIRESTORE } from "../../database/firestore.module";
import type { Core, Modules, Users } from "@modular/types";

@Injectable()
export class RegistryService {
  constructor(@Inject(FIRESTORE) private readonly db: Firestore) {}

  private toInfo(
    d: FirebaseFirestore.QueryDocumentSnapshot,
  ): Modules.ModuleInfo {
    const data = d.data() as Partial<Modules.ModuleInfo> & {
      key?: Core.ModuleKey;
    };
    const key = data.key ?? (d.id as Core.ModuleKey);
    return {
      key,
      name: data.name ?? d.id,
      route: data.route ?? `/${d.id}`,
      public: Boolean(data.public),
      icon: data.icon,
      description: data.description,
      order: data.order,
    };
  }

  async listPublic(): Promise<Modules.ModuleInfo[]> {
    const snap = await this.db.collection("modules").get();
    return snap.docs
      .map((d) => this.toInfo(d))
      .filter((m) => m.public === true)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }

  async listVisible(uid?: string): Promise<Modules.ModuleInfo[]> {
    const snap = await this.db.collection("modules").get();
    const all = snap.docs.map((d) => this.toInfo(d));

    if (!uid) {
      return all
        .filter((m) => m.public === true)
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    }

    const userDoc = await this.db.doc(`users/${uid}`).get();
    const u = (userDoc.data() as Users.UserDoc | undefined) ?? {};
    const roles = new Set<string>(u.roles ?? []);
    const isAdmin = roles.has("admin");
    const enabled = new Set<Core.ModuleKey>(u.enabledModules ?? []);

    return all
      .filter((m) => m.public || isAdmin || enabled.has(m.key))
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }
}
