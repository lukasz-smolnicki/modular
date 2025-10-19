import { Inject, Injectable } from "@nestjs/common";
import { Firestore } from "@google-cloud/firestore";
import { FIRESTORE } from "../../database/firestore.module";
import type { Users } from "@modular/types";

@Injectable()
export class UsersService {
  constructor(@Inject(FIRESTORE) private readonly db: Firestore) {}

  async getEnabledMap(userId: string): Promise<Users.EnabledModulesMap> {
    const snap = await this.db.doc(`users/${userId}`).get();
    const data = (snap.data() || {}) as Partial<Users.UserDoc>;
    const map: Users.EnabledModulesMap = { ...(data.enabled ?? {}) };

    if (Array.isArray(data.enabledModules)) {
      for (const k of data.enabledModules) {
        if (map[k] == null) map[k] = "read";
      }
    }
    return map;
  }
}
