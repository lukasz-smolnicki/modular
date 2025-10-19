import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HealthScreen from "@/modules/health/HealthScreen";
import ModulePickerScreen from "@/modules/shell/ModulePickerScreen";
import LoginScreen from "@/modules/auth/LoginScreen";
import UserScreen from "@/modules/user/UserScreen";
import TopBar from "@/modules/shell/TopBar";

export type RootStackParamList = {
  Health: undefined;
  Modules: undefined;
  Auth: undefined;
  User: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const port = Number(process.env.EXPO_WEB_PORT ?? 8081);
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [`http://localhost:${port}`, "/"],
  config: {
    screens: {
      User: "user",
      Health: "health",
      Modules: "modules",
      Auth: "auth",
    },
  },
};

export default function RootNavigator()
{
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          header: () => <TopBar />,
        }}
        initialRouteName="User"
      >
        <Stack.Screen name="User" component={UserScreen} />
        <Stack.Screen name="Health" component={HealthScreen} />
        <Stack.Screen name="Modules" component={ModulePickerScreen} />
        <Stack.Screen name="Auth" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
