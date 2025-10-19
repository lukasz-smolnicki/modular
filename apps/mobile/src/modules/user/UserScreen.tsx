import { View, Text, StyleSheet } from "react-native";

export default function UserScreen() {
  return (
    <View style={s.wrap}>
      <Text style={s.h1}>User</Text>
      <Text style={s.p}>Placeholder modułu użytkownika (MVP).</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 24 },
  h1: { fontSize: 20, fontWeight: "600" },
  p: { marginTop: 8, opacity: 0.8 },
});
