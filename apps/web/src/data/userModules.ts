import type { Modules, Users } from "@modular/types";
import { apiGet } from "@/api/client";

export async function fetchPublicModules(): Promise<Modules.ModuleInfo[]> {
  const res = await apiGet<Modules.ModuleInfo[]>("/modules/registry/public");
  return Array.isArray(res) ? res : [];
}

export async function fetchVisibleModules(
  uid: string,
): Promise<Modules.ModuleInfo[]> {
  const res = await apiGet<Modules.ModuleInfo[]>(
    `/modules/registry/visible?uid=${encodeURIComponent(uid)}`,
  );
  return Array.isArray(res) ? res : [];
}

export async function fetchUserSettings(
  uid: string,
): Promise<Users.UserSettings> {
  const res = await fetch(`/viewer/${encodeURIComponent(uid)}`, {
    method: "GET",
  }).catch(() => undefined);
  if (!res || !res.ok) return { uid, enabled: [], isAdmin: false };
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json"))
    return { uid, enabled: [], isAdmin: false };
  const json = (await res.json()) as Partial<Users.UserSettings>;
  return {
    uid,
    enabled: (json.enabled ?? []) as string[],
    isAdmin: Boolean(json.isAdmin),
  };
}
