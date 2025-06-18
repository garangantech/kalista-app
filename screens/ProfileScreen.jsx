import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [datePickerKey, setDatePickerKey] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem("@user_profile");
        if (stored) {
          setProfile(JSON.parse(stored));
        }
      } catch (e) {
        console.log("❌ Gagal muat profil:", e);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (key, value) => {
    setProfile({ ...profile, [key]: value });
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem("@user_profile", JSON.stringify(profile));
      setIsEditing(false);
      Alert.alert("✅ Berhasil", "Profil berhasil disimpan");
    } catch (e) {
      console.log("❌ Gagal simpan profil:", e);
    }
  };

  const openDatePicker = (key) => {
    setDatePickerKey(key);
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate && datePickerKey) {
      const iso = selectedDate.toISOString();
      handleChange(datePickerKey, iso);
    }
    setDatePickerKey(null); // tutup date picker
  };

  const renderField = (label, key, isDate = false) => {
    const value = profile[key];
    const isDateField = isDate && isEditing;

    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}:</Text>
        {isEditing ? (
          isDateField ? (
            <TouchableOpacity
              onPress={() => openDatePicker(key)}
              style={styles.dateButton}
            >
              <Text>
                {value ? new Date(value).toDateString() : "Pilih Tanggal"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TextInput
              style={styles.input}
              value={value ? String(value) : ""}
              onChangeText={(text) => handleChange(key, text)}
            />
          )
        ) : (
          <Text style={styles.value}>
            {isDate ? (value ? new Date(value).toDateString() : "-") : value}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Pengguna</Text>

      {renderField("Nama", "name")}
      {renderField("Status", "status")}
      {renderField("Tanggal Lahir", "birthDate", true)}
      {renderField("Memiliki Anak", "hasChild")}
      {renderField("Haid Terakhir", "lastPeriod", true)}
      {renderField("HPL", "hpl", true)}

      {datePickerKey && (
        <DateTimePicker
          mode="date"
          value={
            profile[datePickerKey]
              ? new Date(profile[datePickerKey])
              : new Date()
          }
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      )}

      <View style={{ marginTop: 20 }}>
        {isEditing ? (
          <Button title="Simpan" onPress={handleSave} />
        ) : (
          <Button title="Edit Profil" onPress={() => setIsEditing(true)} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
  },
  value: {
    fontSize: 15,
    color: "#333",
    paddingVertical: 4,
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
});
