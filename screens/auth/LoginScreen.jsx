import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "../../services/axiosInstance";
import { API } from "../../utils/api";
import { resetToMainTabs } from "../../navigation/RootNavigation";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Peringatan", "Email dan password wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Attempting login...");
      console.log("Payload:", { email, password });

      const res = await axios.post(API.login, { email, password });

      console.log("Login success:", res.data);

      const { user, token } = res.data;

      await AsyncStorage.setItem("@token", token);
      await AsyncStorage.setItem("@user_profile", JSON.stringify(user));

      console.log("Token & user saved.");
      console.log("Navigating to MainTabs...");

      resetToMainTabs();
    } catch (error) {
      console.log("Login error:");

      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Status:", error.response.status);
        Alert.alert(
          "Login Gagal",
          error.response.data.message || "Terjadi kesalahan dari server."
        );
      } else if (error.request) {
        console.log("Request sent, no response received:", error.request);
        Alert.alert(
          "Login Gagal",
          "Tidak dapat terhubung ke server. Cek koneksi atau IP backend."
        );
      } else {
        console.log("Unknown error:", error.message);
        Alert.alert("Login Gagal", "Terjadi kesalahan. Coba lagi nanti.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Masuk ke KALISTA</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title={isSubmitting ? "Memproses..." : "Masuk"}
        onPress={handleLogin}
        disabled={isSubmitting}
        color="#fe61ad"
      />

      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={{ color: "#555" }}>
          Belum punya akun?{" "}
          <Text style={{ color: "#fe61ad" }}>Daftar di sini</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff0f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    color: "#fe61ad",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
});
