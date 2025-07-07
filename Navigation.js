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
import SplashScreen from "./screens/SplashScreen";
import { ActivityIndicator } from "react-native";
import LoginScreen from "./screens/auth/LoginScreen";

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
        options={({ navigation }) => ({
          headerTitle: () => <CustomDashboardHeader navigation={navigation} />,
          headerTitleAlign: "center",
          headerTitleContainerStyle: { width: "100%" },
          headerStyle: {
            backgroundColor: "#fff",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          },
        })}
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("@token");
      setIsAuthenticated(!!token); // true kalau token ada
      setIsLoading(false);
    };
    checkToken();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fe61ad" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            {/* Semua fitur yang sudah kamu punya */}
            <Stack.Screen name="Menstruation" component={MenstruationScreen} />
            <Stack.Screen name="Pregnancy" component={PregnancyScreen} />
            <Stack.Screen name="Immunization" component={ImmunizationScreen} />
            <Stack.Screen
              name="PregnancyPlan"
              component={PregnancyPlanScreen}
            />
            <Stack.Screen name="Pranikah" component={PranikahScreen} />
            <Stack.Screen name="Edukasi" component={EdukasiScreen} />
            <Stack.Screen
              name="EdukasiDetail"
              component={EdukasiDetailScreen}
            />
            <Stack.Screen name="GrowthChart" component={GrowthChartScreen} />
            <Stack.Screen name="KB" component={KBScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen
              name="BMICalculator"
              component={BMICalculatorScreen}
            />
            <Stack.Screen
              name="WaterCalculator"
              component={WaterCalculatorScreen}
            />
            <Stack.Screen name="ChecklistScreen" component={ChecklistScreen} />
            <Stack.Screen name="MoodTracker" component={MoodTrackerScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
