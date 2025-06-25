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
import CustomDashboardHeader from "./components/CustomDashboardHeader";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
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
              onPress={() => console.log("Profile dibuka")}
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
          title: "Semua Menu Fiturs",
          headerTitle: () => (
            <TouchableOpacity
              onPress={() => console.log("tombol ditekan")}
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
      <Tab.Screen name="Notif" component={ProfileScreen} />
      <Tab.Screen name="About" component={MenuScreen} />
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
            <Stack.Screen
              name="Menstruation"
              component={MenstruationScreen}
              options={{ headerShown: true, title: "Fitur Siklus Haid" }}
            />
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
