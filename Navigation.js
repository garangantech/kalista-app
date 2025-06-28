import React, { useEffect, useRef, useState } from "react";
import {
  NavigationContainer,
  useNavigation,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import OnboardingScreen from "./screens/OnboardingScreen";
import DashboardScreen from "./screens/DashboardScreen";
import MenuScreen from "./screens/MenuScreen";
import ProfileScreen from "./screens/ProfileScreen";
import MenstruationScreen from "./screens/MenstruationScreen";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import PregnancyScreen from "./screens/PregnancyScreen";
import ImmunizationScreen from "./screens/ImmunizationScreen";
import PregnancyPlanScreen from "./screens/PregnancyPlanScreen";
import PranikahScreen from "./screens/PranikahScreen";
import PranikahDetailScreen from "./screens/PranikahDetailScreen";
import EdukasiScreen from "./screens/EdukasiScreen";
import EdukasiDetailScreen from "./screens/EdukasiDetailScreen";
import GrowthChartScreen from "./screens/GrowthChartScreen";
import KBScreen from "./screens/KBScreen";
import CustomDashboardHeader from "./components/CustomDashboardHeader";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import BMICalculatorScreen from "./screens/BMICalculatorScreen";
import WaterCalculatorScreen from "./screens/WaterCalculatorScreen";
import ChecklistScreen from "./screens/ChecklistScreen";
import MoodTrackerScreen from "./screens/MoodTrackerScreen";
import NotificationScreen from "./screens/NotificationScreen";
import AboutScreen from "./screens/AboutScreen";
import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: "#fe61ad",
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Menu") iconName = "apps-outline";
          else if (route.name === "Notif") iconName = "notifications-outline";
          else if (route.name === "About")
            iconName = "information-circle-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          headerTitle: () => (
            <CustomDashboardHeader
              onPress={() => navigation.navigate("Profile")}
            />
          ),
          headerTitleAlign: "center",
          headerTitleContainerStyle: {
            width: "100%",
          },
          headerStyle: {
            backgroundColor: "#fff",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          },
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          headerTitle: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MainTabs", { screen: "Home" })
              }
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Ionicons name="arrow-back" size={24} />
              <Text style={{ fontSize: 20 }}>Semua Menu Fitur</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Notif"
        component={NotificationScreen}
        options={{
          headerTitle: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MainTabs", { screen: "Home" })
              }
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Ionicons name="arrow-back" size={24} />
              <Text style={{ fontSize: 20 }}>Notifikasi</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          headerTitle: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MainTabs", { screen: "Home" })
              }
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Ionicons name="arrow-back" size={24} />
              <Text style={{ fontSize: 20 }}>Tentang Aplikasi</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const [isLoading, setIsLoading] = useState(true);
  const [firstTimeUser, setFirstTimeUser] = useState(false);
  const [appKey, setAppKey] = useState(0);
  const [reloadFlag, setReloadFlag] = useState(0);

  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem("@user_profile");
      if (user) {
        const parsed = JSON.parse(user);
        const isComplete = parsed.name && parsed.status;
        setFirstTimeUser(!isComplete);
      } else {
        setFirstTimeUser(true);
      }

      setIsLoading(false);
    };
    checkUser();
  }, [reloadFlag]);

  useEffect(() => {
    const unsubscribe = navigationRef?.addListener("state", () => {
      const reload = navigationRef.getCurrentRoute()?.params?.reload;
      if (reload) {
        setReloadFlag((prev) => prev + 1); // trigger reload
      }
    });

    return unsubscribe;
  }, []);

  if (isLoading) return null; // Bisa ditambahkan splash/loading screen

  return (
    <NavigationContainer ref={navigationRef} key={appKey}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {firstTimeUser ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />

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
              name="PranikahDetail"
              component={PranikahDetailScreen}
              options={{ headerShown: true, headerTitle: "Fitur Pranikah" }}
            />
            <Stack.Screen
              name="Edukasi"
              component={EdukasiScreen}
              options={{ headerShown: true, headerTitle: "Artikel Edukasi" }}
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
