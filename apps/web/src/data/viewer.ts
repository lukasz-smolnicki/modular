import type { Users } from "@modular/types";

export async function getViewer(uid: string): Promise<Users.UserSettings> {
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
