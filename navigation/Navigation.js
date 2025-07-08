import { navigationRef } from "./RootNavigation"; // atau definisi lain
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MoodTrackerScreen from "../screens/MoodTrackerScreen";
import ChecklistScreen from "../screens/ChecklistScreen";
import WaterCalculatorScreen from "../screens/WaterCalculatorScreen";
import BMICalculatorScreen from "../screens/BMICalculatorScreen";
import ProfileScreen from "../screens/ProfileScreen";
import KBScreen from "../screens/KBScreen";
import GrowthChartScreen from "../screens/GrowthChartScreen";
import EdukasiDetailScreen from "../screens/EdukasiDetailScreen";
import EdukasiScreen from "../screens/EdukasiScreen";
import PranikahScreen from "../screens/PranikahScreen";
import PregnancyPlanScreen from "../screens/PregnancyPlanScreen";
import ImmunizationScreen from "../screens/ImmunizationScreen";
import PregnancyScreen from "../screens/PregnancyScreen";
import MenstruationScreen from "../screens/MenstruationScreen";
import MainTabs from "./MainTabs";
import LoginScreen from "../screens/auth/LoginScreen";
import SplashScreen from "../screens/SplashScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForumChatScreen from "../screens/forum/ForumChatScreen";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ForumChatPerawatScreen from "../screens/forum/ForumChatPerawatScreen";
import ForumListPerawatScreen from "../screens/forum/ForumListPerawatScreen";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="ForumChat"
          component={ForumChatScreen}
          options={{
            headerShown: true,
            headerTitle: "Forum Tanya Jawab",
            headerBackVisible: false, // sembunyikan default back
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigationRef.current?.navigate("MainTabs")}
                style={{ paddingHorizontal: 16 }}
              >
                <Ionicons name="arrow-back" size={24} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="ForumChatPerawat"
          component={ForumChatPerawatScreen}
          options={{
            headerShown: true,
            headerTitle: "Forum Tanya Jawab",
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigationRef.current?.navigate("MainTabs")}
                style={{ paddingHorizontal: 16 }}
              >
                <Ionicons name="arrow-back" size={24} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="ForumListPerawat"
          component={ForumListPerawatScreen}
          options={{
            headerShown: true,
            headerTitle: "Forum Tanya Jawab",
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigationRef.current?.navigate("MainTabs")}
                style={{ paddingHorizontal: 16 }}
              >
                <Ionicons name="arrow-back" size={24} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="Menstruation"
          component={MenstruationScreen}
          options={{ headerShown: true, title: "Fitur Siklus Haid" }}
        />
        <Stack.Screen
          name="Pregnancy"
          component={PregnancyScreen}
          options={{ headerShown: true, headerTitle: "Fitur Kehamilan" }}
        />
        <Stack.Screen
          name="Immunization"
          component={ImmunizationScreen}
          options={{
            headerShown: true,
            headerTitle: "Imunisasi Anak",
          }}
        />
        <Stack.Screen
          name="PregnancyPlan"
          component={PregnancyPlanScreen}
          options={{
            headerShown: true,
            headerTitle: "Program Kehamilan",
          }}
        />
        <Stack.Screen
          name="Pranikah"
          component={PranikahScreen}
          options={{ headerShown: true, headerTitle: "Fitur Pranikah" }}
        />
        <Stack.Screen
          name="Edukasi"
          component={EdukasiScreen}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="EdukasiDetail"
          component={EdukasiDetailScreen}
          options={{ headerShown: true, headerTitle: "Artikel Edukasi" }}
        />
        <Stack.Screen
          name="GrowthChart"
          component={GrowthChartScreen}
          options={{
            headerShown: true,
            headerTitle: "Tumbuh Kembang Anak",
          }}
        />
        <Stack.Screen
          name="KB"
          component={KBScreen}
          options={{ headerShown: true, headerTitle: "Simulasi KB" }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: true, headerTitle: "Profil Pengguna" }}
        />
        <Stack.Screen
          name="BMICalculator"
          component={BMICalculatorScreen}
          options={{
            headerShown: true,
            headerTitle: "BMI (BodyMass Index)",
          }}
        />
        <Stack.Screen
          name="WaterCalculator"
          component={WaterCalculatorScreen}
          options={{
            headerShown: true,
            headerTitle: "Kebutuhan Air Harian",
          }}
        />
        <Stack.Screen
          name="ChecklistScreen"
          component={ChecklistScreen}
          options={{
            headerShown: true,
            headerTitle: "Checklist Persiapan",
          }}
        />
        <Stack.Screen
          name="MoodTracker"
          component={MoodTrackerScreen}
          options={{
            headerShown: true,
            headerTitle: "Mood Tracker Harian",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
