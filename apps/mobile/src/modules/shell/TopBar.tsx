import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import
  {
    useNavigation,
    useRoute,
    type NavigationProp
  } from "@react-navigation/native";
import { apiGet } from "@/api/client";
import type { Modules } from "@modular/types";
import type { RootStackParamList } from "@/navigation/RootNavigator";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { fetchUserSettings } from "@/data/userModules";

function resolveRoute(m: Modules.ModuleInfo): keyof RootStackParamList
{
  const key = (m.key || "").toLowerCase();
  const route = m.route || `/${key}`;
  if (key === "users" || route === "/users" || route === "/user") return "User";
  if (route === "/health") return "Health";
  if (route === "/modules" || key === "modules") return "Modules";
  if (route === "/auth") return "Auth";
  return "Modules";
}

function sortModules(a: Modules.ModuleInfo, b: Modules.ModuleInfo)
{
  const ao = a.order ?? 999;
  const bo = b.order ?? 999;
  if (ao !== bo) return ao - bo;
  return (a.name || "").localeCompare(b.name || "");
}

export default function TopBar()
{
  const [mods, setMods] = useState<Modules.ModuleInfo[]>([]);
  const [open, setOpen] = useState(false);
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { user } = useAuthStatus();
  const [enabled, setEnabled] = useState<string[] | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() =>
  {
    let on = true;
    (async () =>
    {
      try
      {
        const list = (await apiGet<Modules.ModuleInfo[]>("/modules/registry/public")) ?? [];
        if (on) setMods(list.sort(sortModules));
      } catch
      {
        if (on) setMods([]);
      }
    })();
    return () =>
    {
      on = false;
    };
  }, []);

  useEffect(() =>
  {
    let on = true;
    (async () =>
    {
      if (!user)
      {
        if (on)
        {
          setEnabled(null);
          setIsAdmin(false);
        }
        return;
      }
      try
      {
        const s = await fetchUserSettings(user.uid);
        if (on)
        {
          setEnabled(s.enabled);
          setIsAdmin(s.isAdmin);
        }
      } catch
      {
        if (on)
        {
          setEnabled([]);
          setIsAdmin(false);
        }
      }
    })();
    return () =>
    {
      on = false;
    };
  }, [user?.uid]);

  const visibleMods = useMemo(() =>
  {
    if (!user) return mods;
    if (isAdmin) return mods;
    const set = new Set<string>(["users", ...(enabled ?? [])]);
    return mods.filter((m) => set.has(m.key));
  }, [mods, user, enabled, isAdmin]);

  function goTo(m: Modules.ModuleInfo)
  {
    setOpen(false);
    const name = resolveRoute(m);
    nav.navigate(name);
  }

  return (
    <View style={s.bar}>
      <Text style={s.brand}>PowerApp</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Pressable onPress={() => setOpen((p) => !p)} style={s.ddBtn} testID="modules-toggle">
          <Text style={s.ddText}>Moduły ▾</Text>
        </Pressable>
        <Text style={s.where}>{String(route.name)}</Text>
      </View>
      {open && (
        <View style={s.ddMenu} testID="modules-menu">
          {visibleMods.map((m) => (
            <Pressable key={m.key} onPress={() => goTo(m)} style={s.ddItem}>
              <Text style={{ marginRight: 6 }}>{m.icon ?? "•"}</Text>
              <Text>{m.name}</Text>
            </Pressable>
          ))}
          {visibleMods.length === 0 && <Text style={{ opacity: 0.6 }}>Brak modułów</Text>}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    height: 48,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  brand: { fontWeight: "700" },
  where: { opacity: 0.6 },
  ddBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6
  },
  ddText: { fontWeight: "600" },
  ddMenu: {
    position: "absolute",
    top: 48,
    right: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 8,
    gap: 6,
    zIndex: 10
  },
  ddItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center"
  }
});
