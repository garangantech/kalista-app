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
    console.log("Data berhasil disimpan:", userProfile);

    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    }); // masuk ke Home tab setelah selesai
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

          <Button title="Lanjut" onPress={() => setStep(2)} />
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

          <Button title="Lanjut" onPress={() => setStep(3)} />
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
          <Button title="Simpan dan Mulai" onPress={handleSave} />
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
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#f0f4f8",
    borderRadius: 6,
    marginVertical: 10,
  },
  option: {
    padding: 10,
    backgroundColor: "#eee",
    marginVertical: 6,
    borderRadius: 6,
  },
  selected: {
    backgroundColor: "#a4d4ff",
  },
});
