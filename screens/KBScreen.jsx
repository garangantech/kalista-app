import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function KBScreen() {
  const [statusMenikah, setStatusMenikah] = useState("sudah");
  const [inginAnak, setInginAnak] = useState("tidak");
  const [frekuensi, setFrekuensi] = useState("rutin");
  const [preferensi, setPreferensi] = useState("jangka_panjang");
  const [riwayat, setRiwayat] = useState("normal");

  const [hasil, setHasil] = useState(null);

  const simulasikan = () => {
    let metode = "";
    let penjelasan = "";

    if (preferensi === "tanpa_hormon" && riwayat === "normal") {
      metode = "IUD (Spiral)";
      penjelasan =
        "IUD adalah alat kontrasepsi jangka panjang tanpa hormon, cocok untuk kamu yang ingin menghindari efek samping hormon.";
    } else if (preferensi === "jangka_panjang") {
      metode = "Implant / IUD";
      penjelasan =
        "Implant cocok untuk jangka panjang hingga 3–5 tahun. IUD juga bisa bertahan 5–10 tahun.";
    } else if (preferensi === "cepat_hamil" && inginAnak === "ya") {
      metode = "Kondom atau Metode Kalender";
      penjelasan =
        "Metode ini tidak mempengaruhi kesuburan dan bisa langsung berhenti kapan saja.";
    } else if (riwayat === "menyusui") {
      metode = "Pil KB Laktasi / IUD";
      penjelasan =
        "Pil laktasi (progestin saja) aman untuk ibu menyusui. IUD juga aman.";
    } else {
      metode = "Pil KB atau Suntik";
      penjelasan =
        "Pil KB atau suntik adalah metode hormonal yang efektif dan mudah digunakan.";
    }

    setHasil({ metode, penjelasan });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Simulasi Metode KB</Text>

        <Text style={styles.label}>Status Menikah:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={statusMenikah}
            onValueChange={setStatusMenikah}
            style={styles.picker}
          >
            <Picker.Item label="Sudah" value="sudah" />
            <Picker.Item label="Belum" value="belum" />
          </Picker>
          <Ionicons
            name="chevron-down"
            size={20}
            color="#888"
            style={styles.dropdownIcon}
          />
        </View>

        <Text style={styles.label}>Ingin Punya Anak Lagi?</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={inginAnak}
            onValueChange={setInginAnak}
            style={styles.picker}
          >
            <Picker.Item label="Tidak" value="tidak" />
            <Picker.Item label="Ya" value="ya" />
          </Picker>
          <Ionicons
            name="chevron-down"
            size={20}
            color="#888"
            style={styles.dropdownIcon}
          />
        </View>

        <Text style={styles.label}>Frekuensi Hubungan:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={frekuensi}
            onValueChange={setFrekuensi}
            style={styles.picker}
          >
            <Picker.Item label="Rutin" value="rutin" />
            <Picker.Item label="Kadang" value="kadang" />
            <Picker.Item label="Jarang" value="jarang" />
          </Picker>
          <Ionicons
            name="chevron-down"
            size={20}
            color="#888"
            style={styles.dropdownIcon}
          />
        </View>

        <Text style={styles.label}>Preferensi Metode:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={preferensi}
            onValueChange={setPreferensi}
            style={styles.picker}
          >
            <Picker.Item label="Tanpa Hormon" value="tanpa_hormon" />
            <Picker.Item label="Jangka Panjang" value="jangka_panjang" />
            <Picker.Item
              label="Ingin Cepat Hamil Setelah Stop"
              value="cepat_hamil"
            />
          </Picker>
          <Ionicons
            name="chevron-down"
            size={20}
            color="#888"
            style={styles.dropdownIcon}
          />
        </View>

        <Text style={styles.label}>Riwayat Kesehatan:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={riwayat}
            onValueChange={setRiwayat}
            style={styles.picker}
          >
            <Picker.Item label="Normal" value="normal" />
            <Picker.Item label="Menyusui" value="menyusui" />
            <Picker.Item label="Hipertensi / Risiko Lain" value="risiko" />
          </Picker>
          <Ionicons
            name="chevron-down"
            size={20}
            color="#888"
            style={styles.dropdownIcon}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={simulasikan}>
          <Text style={styles.buttonText}>Simulasikan</Text>
        </TouchableOpacity>

        {hasil && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Rekomendasi:</Text>
            <Text style={styles.resultMethod}>{hasil.metode}</Text>
            <Text style={styles.resultDesc}>{hasil.penjelasan}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingBottom: "40%",
    backgroundColor: "#fffafc",
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    marginTop: 14,
    marginBottom: 4,
    fontWeight: "500",
    color: "#444",
  },
  pickerWrapper: {
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingRight: 32,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  picker: {
    color: "#333",
    paddingLeft: 12,
    // paddingVertical: 8,
  },
  dropdownIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    marginTop: -10,
    pointerEvents: "none", // biar tidak mengganggu klik
  },

  button: {
    backgroundColor: "#fe61ad",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultBox: {
    backgroundColor: "#fff0f5",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fe61ad30",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginTop: 10,
  },
  resultTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  resultMethod: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fe61ad",
    marginBottom: 6,
  },
  resultDesc: {
    fontSize: 14,
    color: "#333",
  },
});
