import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Menu") iconName = "apps";
          else if (route.name === "Profil") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const [isLoading, setIsLoading] = useState(true);
  const [firstTimeUser, setFirstTimeUser] = useState(true);

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
  }, []);

  if (isLoading) return null; // Bisa ditambahkan splash/loading screen

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {firstTimeUser ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Menstruation" component={MenstruationScreen} />
            <Stack.Screen name="Pregnancy" component={PregnancyScreen} />
            <Stack.Screen name="Immunization" component={ImmunizationScreen} />
            <Stack.Screen
              name="PregnancyPlan"
              component={PregnancyPlanScreen}
            />
            <Stack.Screen name="Pranikah" component={PranikahScreen} />
            <Stack.Screen
              name="PranikahDetail"
              component={PranikahDetailScreen}
            />
            <Stack.Screen name="Edukasi" component={EdukasiScreen} />
            <Stack.Screen
              name="EdukasiDetail"
              component={EdukasiDetailScreen}
            />
            <Stack.Screen name="GrowthChart" component={GrowthChartScreen} />
            <Stack.Screen name="KB" component={KBScreen} />
            {/* Tambah screen lain di sini nanti */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
