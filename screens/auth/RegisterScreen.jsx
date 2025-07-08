import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "../../services/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function RegisterScreen() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    status: "",
    birth_date: "",
    last_period: "",
    hpl: "",
    has_child: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(null); // key: 'birth_date', etc

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      handleChange(showDatePicker, dateStr);
    }
    setShowDatePicker(null);
  };

  const handleRegister = async () => {
    const { name, email, password, status } = form;
    if (!name || !email || !password || !status) {
      Alert.alert("Peringatan", "Field wajib belum diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post("/register", {
        ...form,
        role: "user",
      });

      const { user, token } = res.data;
      await AsyncStorage.setItem("@token", token);
      await AsyncStorage.setItem("@user_profile", JSON.stringify(user));

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Registrasi gagal, coba lagi.";
      Alert.alert("Error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Daftar Pengguna Baru</Text>

      <TextInput
        placeholder="Nama Lengkap"
        placeholderTextColor="gray"
        style={styles.input}
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="gray"
        style={styles.input}
        keyboardType="email-address"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="gray"
        style={styles.input}
        secureTextEntry
        value={form.password}
        onChangeText={(text) => handleChange("password", text)}
      />
      <TextInput
        placeholder="Status (remaja / hamil / menyusui)"
        placeholderTextColor="gray"
        style={styles.input}
        value={form.status}
        onChangeText={(text) => handleChange("status", text)}
      />

      {/* Date Picker Fields */}
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowDatePicker("birth_date")}
      >
        <Text>Tanggal Lahir: {form.birth_date || "Pilih tanggal"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowDatePicker("last_period")}
      >
        <Text>Haid Terakhir: {form.last_period || "Pilih tanggal"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowDatePicker("hpl")}
      >
        <Text>HPL (jika hamil): {form.hpl || "Pilih tanggal"}</Text>
      </TouchableOpacity>

      {/* Switch for has_child */}
      <View style={styles.switchRow}>
        <Text>Sudah punya anak?</Text>
        <Switch
          value={form.has_child}
          onValueChange={(val) => handleChange("has_child", val)}
        />
      </View>

      {/* Date Picker actual */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="calendar"
          onChange={handleDateChange}
        />
      )}

      {/* Submit */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "Mendaftar..." : "Daftar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Sudah punya akun? Masuk</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff0f5",
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fe61ad",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 14,
  },
  dateInput: {
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 14,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#fe61ad",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    color: "#fe61ad",
    textAlign: "center",
    marginTop: 10,
  },
});
