import { View, Text, StyleSheet } from "react-native";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import LoginScreen from "@/modules/auth/LoginScreen";

export default function UserScreen() {
  const { user, loading } = useAuthStatus();

  if (loading) {
    return (
      <View style={s.wrap}>
        <Text>Ładowanie…</Text>
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <View style={s.wrap}>
      <Text style={s.h1}>Panel użytkownika</Text>
      <Text style={s.p}>Zalogowano jako: {user.email || user.uid}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 24 },
  h1: { fontSize: 20, fontWeight: "600" },
  p: { marginTop: 8, opacity: 0.8 },
});
