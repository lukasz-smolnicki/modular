import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HealthScreen from "@/modules/health/HealthScreen";
import ModulePickerScreen from "@/modules/shell/ModulePickerScreen";

type RootStackParamList = {
  Health: undefined;
  Modules: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const port = Number(process.env.EXPO_WEB_PORT ?? 8081);
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [`http://localhost:${port}`, "/"],
  config: {
    screens: {
      Health: "health",
      Modules: "modules",
    },
  },
};

export default function RootNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Health"
      >
        <Stack.Screen name="Health" component={HealthScreen} />
        <Stack.Screen name="Modules" component={ModulePickerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
