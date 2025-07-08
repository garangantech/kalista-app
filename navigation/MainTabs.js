import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text } from "react-native";

import DashboardScreen from "../screens/DashboardScreen";
import MenuScreen from "../screens/MenuScreen";
import NotificationScreen from "../screens/NotificationScreen";
import AboutScreen from "../screens/AboutScreen";
import CustomDashboardHeader from "../components/CustomDashboardHeader";
import ForumEntryRedirect from "../screens/forum/ForumEntryRedirect";

const Tab = createBottomTabNavigator();

export default function MainTabs({ navigation }) {
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
        name="Forum"
        component={ForumEntryRedirect}
        options={{
          tabBarLabel: "Forum",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
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
