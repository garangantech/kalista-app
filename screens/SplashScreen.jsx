import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";

export default function SplashScreen() {
  const navigation = useNavigation();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("@token");

      // Delay 1.5 detik biar sempat lihat splash
      setTimeout(() => {
        if (token) {
          navigation.reset({
            index: 0,
            routes: [{ name: "MainTabs" }],
          });
        } else {
          setCheckingAuth(false); // tampilkan UI login/register
        }
      }, 1500);
    };

    checkToken();
  }, []);

  if (checkingAuth) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fe61ad" />
        <Text style={{ marginTop: 20 }}>Memeriksa sesi login...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Logo / Ilustrasi */}
      <Image
        source={require("../assets/login.png")} // ganti sesuai logo kamu
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Judul & Tagline */}
      <Text style={styles.title}>KALISTA</Text>
      <Text style={styles.subtitle}>Kesehatan Wanita & Ibu Anak</Text>

      {/* Tombol Aksi */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Masuk</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.buttonTextSecondary}>Daftar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff0f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fe61ad",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "100%",
  },
  buttonPrimary: {
    backgroundColor: "#fe61ad",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: "#fe61ad",
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonTextSecondary: {
    color: "#fe61ad",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});
