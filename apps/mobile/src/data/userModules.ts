import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firestore";
import type { Users, Core } from "@modular/types";

export async function fetchUserSettings(uid: string): Promise<{
    enabled: Core.ModuleKey[];
    isAdmin: boolean;
}>
{
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    const data = (snap.data() || {}) as Partial<Users.UserDoc> & { roles?: string[] };

    const enabledArr = Array.isArray(data.enabledModules) ? data.enabledModules : undefined;
    const enabledMap = data.enabled && typeof data.enabled === "object" ? Object.keys(data.enabled) : undefined;
    const enabled = (enabledArr ?? enabledMap ?? []) as Core.ModuleKey[];

    const roles = Array.isArray((data as any).roles) ? (data as any).roles : [];
    const isAdmin = roles.includes("admin");

    return { enabled, isAdmin };
}
