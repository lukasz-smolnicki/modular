import { Inject, Injectable } from "@nestjs/common";
import { Firestore } from "@google-cloud/firestore";
import { FIRESTORE } from "../../database/firestore.module";
import type { Core, Modules } from "@modular/types";

@Injectable()
export class RegistryService
{
  constructor(@Inject(FIRESTORE) private readonly db: Firestore) { }

  async listPublic(): Promise<Modules.ModuleInfo[]>
  {
    const snap = await this.db.collection("modules").where("public", "==", true).get();

    const list = snap.docs.map((d) =>
    {
      const data = d.data() as Partial<Modules.ModuleInfo> & { key?: Core.ModuleKey };
      const key = (data.key ?? (d.id as Core.ModuleKey)) as Core.ModuleKey;
      return {
        key,
        name: data.name ?? d.id,
        route: data.route ?? `/${d.id}`,
        public: Boolean(data.public),
        ...(data as Record<string, unknown>)
      } as Modules.ModuleInfo;
    });

    list.sort((a, b) =>
    {
      const ao = (a as unknown as { order?: number }).order ?? 9999;
      const bo = (b as unknown as { order?: number }).order ?? 9999;
      return ao - bo;
    });

    return list;
  }
}
