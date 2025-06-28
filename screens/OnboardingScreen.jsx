import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function OnboardingScreen({ navigation }) {
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [status, setStatus] = useState("");
  const [lastPeriod, setLastPeriod] = useState(null);
  const [hpl, setHpl] = useState(null);
  const [hasChild, setHasChild] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState("");
  const [saving, setSaving] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (datePickerType === "birth") setBirthDate(selectedDate);
      else if (datePickerType === "period") setLastPeriod(selectedDate);
      else if (datePickerType === "hpl") setHpl(selectedDate);
    }
  };

  const handleSave = async () => {
    const userProfile = {
      name,
      birthDate: birthDate.toISOString(),
      status,
      lastPeriod: lastPeriod ? lastPeriod.toISOString() : null,
      hpl: hpl ? hpl.toISOString() : null,
      hasChild,
    };
    await AsyncStorage.setItem("@user_profile", JSON.stringify(userProfile));
    console.log("✅ Data berhasil disimpan:", userProfile);

    // Navigasi ulang ke root untuk trigger useEffect
    navigation.navigate("Onboarding", { reload: Date.now() });
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <>
          <Text style={styles.title}>Langkah 1 dari 3</Text>
          <Text>Nama Panggilan:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text>Tanggal Lahir:</Text>
          <TouchableOpacity
            onPress={() => {
              setDatePickerType("birth");
              setShowDatePicker(true);
            }}
            style={styles.dateButton}
          >
            <Text>{birthDate.toDateString()}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => setStep(2)}
          >
            <Text style={styles.buttonText}>Lanjut</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.title}>Langkah 2 dari 3</Text>
          <Text>Status Kamu:</Text>
          {["Remaja", "Calon Pengantin", "Ibu Hamil", "Orang Tua"].map(
            (item) => (
              <TouchableOpacity
                key={item}
                style={[styles.option, status === item && styles.selected]}
                onPress={() => setStatus(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )
          )}

          {status === "Ibu Hamil" && (
            <>
              <Text>HPL (Hari Perkiraan Lahir):</Text>
              <TouchableOpacity
                onPress={() => {
                  setDatePickerType("hpl");
                  setShowDatePicker(true);
                }}
                style={styles.dateButton}
              >
                <Text>{hpl ? hpl.toDateString() : "Pilih Tanggal"}</Text>
              </TouchableOpacity>
            </>
          )}

          {status === "Remaja" || status === "Calon Pengantin" ? (
            <>
              <Text>Tanggal Haid Terakhir:</Text>
              <TouchableOpacity
                onPress={() => {
                  setDatePickerType("period");
                  setShowDatePicker(true);
                }}
                style={styles.dateButton}
              >
                <Text>
                  {lastPeriod ? lastPeriod.toDateString() : "Pilih Tanggal"}
                </Text>
              </TouchableOpacity>
            </>
          ) : null}

          {status === "Orang Tua" && (
            <TouchableOpacity
              onPress={() => setHasChild((prev) => !prev)}
              style={styles.option}
            >
              <Text>
                {hasChild ? "✓ Saya memiliki anak" : "Saya memiliki anak"}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => setStep(3)}
          >
            <Text style={styles.buttonText}>Lanjut</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.title}>Konfirmasi</Text>
          <Text>Nama: {name}</Text>
          <Text>Tgl Lahir: {birthDate.toDateString()}</Text>
          <Text>Status: {status}</Text>
          {lastPeriod && (
            <Text>Haid Terakhir: {lastPeriod.toDateString()}</Text>
          )}
          {hpl && <Text>HPL: {hpl.toDateString()}</Text>}
          {status === "Orang Tua" && (
            <Text>Punya anak: {hasChild ? "Ya" : "Tidak"}</Text>
          )}
          <TouchableOpacity style={styles.buttonPrimary} onPress={handleSave}>
            <Text style={styles.buttonText}>Simpan dan Mulai</Text>
          </TouchableOpacity>
        </>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fffafc",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fe61ad",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#fe61ad30",
    padding: 12,
    marginVertical: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  dateButton: {
    padding: 12,
    backgroundColor: "#fdf1f7",
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#fe61ad20",
  },
  option: {
    padding: 14,
    backgroundColor: "#f0f0f0",
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selected: {
    backgroundColor: "#feebf4",
    borderColor: "#fe61ad",
  },
  buttonPrimary: {
    backgroundColor: "#fe61ad",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
