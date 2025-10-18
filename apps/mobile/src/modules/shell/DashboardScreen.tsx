import { View, Text, StyleSheet, Pressable } from "react-native";
import Header from "./Header";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/RootNavigator";

export default function DashboardScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={s.wrap}>
        <Text style={s.h1}>Pulpit</Text>
        <Text style={s.p}>Witaj w Modular. Wybierz moduł z listy.</Text>
        <Pressable onPress={() => nav.navigate("Modules")} style={s.btn}>
          <Text style={s.btnText}>Przejdź do modułów</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 16 },
  h1: { fontSize: 20, fontWeight: "600" },
  p: { marginTop: 8, marginBottom: 12 },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  btnText: { fontWeight: "600" },
});
