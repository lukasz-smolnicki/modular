import { apiGet } from "@/api/client";
import type { Modules } from "@modular/types";

export type UserSettings = {
    modules: Modules.ModuleInfo[];
};

export async function fetchUserSettings(): Promise<UserSettings>
{
    const list = (await apiGet<Modules.ModuleInfo[]>("/modules/registry/public")) ?? [];

    const normalized = list.map((m) =>
    {
        if (m.key === "users" && (!m.route || m.route === "/users"))
        {
            return { ...m, route: "/user" };
        }
        return m;
    });

    normalized.sort((a, b) =>
    {
        const ao = (a as unknown as { order?: number }).order ?? 9999;
        const bo = (b as unknown as { order?: number }).order ?? 9999;
        return ao - bo;
    });

    return { modules: normalized };
}
