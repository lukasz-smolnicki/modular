import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import
    {
        useNavigation,
        useRoute,
        type NavigationProp,
    } from "@react-navigation/native";
import { apiGet } from "@/api/client";
import type { Modules } from "@modular/types";
import type { RootStackParamList } from "@/navigation/RootNavigator";

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

export default function TopBar()
{
    const [mods, setMods] = useState<Modules.ModuleInfo[]>([]);
    const [open, setOpen] = useState(false);
    const nav = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute();

    useEffect(() =>
    {
        let on = true;
        (async () =>
        {
            try
            {
                const list =
                    (await apiGet<Modules.ModuleInfo[]>("/modules/registry/public")) ??
                    [];
                if (on) setMods(list);
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
                <Pressable onPress={() => setOpen((p) => !p)} style={s.ddBtn}>
                    <Text style={s.ddText}>Moduły ▾</Text>
                </Pressable>
                <Text style={s.where}>{String(route.name)}</Text>
            </View>
            {open && (
                <View style={s.ddMenu}>
                    {mods.map((m) => (
                        <Pressable key={m.key} onPress={() => goTo(m)} style={s.ddItem}>
                            <Text>{m.name}</Text>
                        </Pressable>
                    ))}
                    {mods.length === 0 && <Text style={{ opacity: 0.6 }}>Brak modułów</Text>}
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
        justifyContent: "space-between",
    },
    brand: { fontWeight: "700" },
    where: { opacity: 0.6 },
    ddBtn: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 6,
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
        gap: 4,
        zIndex: 10,
    },
    ddItem: { paddingVertical: 6, paddingHorizontal: 8, borderRadius: 6 },
});
