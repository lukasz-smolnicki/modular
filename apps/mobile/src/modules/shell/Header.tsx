import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/RootNavigator";

export default function Header() {
  const user = useAuthUser();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={s.bar}>
      <Text style={s.brand}>Modular</Text>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Pressable onPress={() => nav.navigate("Modules")}>
          <Text style={s.link}>Moduły</Text>
        </Pressable>
        <Text style={s.user}>{user?.email ?? "Gość"}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    height: 48,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  brand: { fontWeight: "600" },
  link: { textDecorationLine: "underline" },
  user: { opacity: 0.7 },
});
