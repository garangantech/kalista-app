import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import DashboardScreen from "../screens/DashboardScreen";
import MenuScreen from "../screens/MenuScreen";
import NotificationScreen from "../screens/NotificationScreen";
import AboutScreen from "../screens/AboutScreen";
import CustomDashboardHeader from "../components/CustomDashboardHeader";

// Forum (user vs perawat)
import ForumEntryRedirect from "../screens/forum/ForumEntryRedirect";
import ForumListPerawatScreen from "../screens/forum/ForumListPerawatScreen";
import ForumChatPerawatScreen from "../screens/forum/ForumChatPerawatScreen";
import ForumEntryRedirectPerawat from "../screens/forum/ForumEntryRedirectPerawat";

const Tab = createBottomTabNavigator();

export default function MainTabs({ navigation }) {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const userData = await AsyncStorage.getItem("@user_profile");
      if (userData) {
        const parsed = JSON.parse(userData);
        setRole(parsed.role); // "user" atau "nurse"
      }
    };
    fetchRole();
  }, []);

  // Tampilkan null/loader saat role belum dimuat
  if (!role) return null;

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
          else if (route.name === "Forum")
            iconName = "chatbubble-ellipses-outline";
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

      {/* Tab Forum bergantung pada role */}
      <Tab.Screen
        name="Forum"
        component={
          role === "perawat" ? ForumEntryRedirectPerawat : ForumEntryRedirect
        }
        options={{
          tabBarLabel: "Forum",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
          headerTitle: role === "perawat" ? "Forum Pasien" : "Forum",
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
