import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ModulePickerScreen from "@/modules/shell/ModulePickerScreen";
import DashboardScreen from "@/modules/shell/DashboardScreen";
import LoginScreen from "@/modules/auth/LoginScreen";
import HealthScreen from "@/modules/health/HealthScreen";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useEffect, useState } from "react";

export type RootStackParamList = {
  Modules: undefined;
  Dashboard: undefined;
  Auth: undefined;
  Health: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const port = Number(process.env.EXPO_WEB_PORT ?? 8081);
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [`http://localhost:${port}`, "/"],
  config: {
    screens: {
      Auth: "auth",
      Dashboard: "",
      Modules: "modules",
      Health: "health",
    },
  },
};

export default function RootNavigator() {
  const user = useAuthUser();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, [user]);

  if (!ready) return null;

  const initial = user ? "Modules" : "Auth";

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initial}
      >
        <Stack.Screen name="Auth" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Modules" component={ModulePickerScreen} />
        <Stack.Screen name="Health" component={HealthScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
