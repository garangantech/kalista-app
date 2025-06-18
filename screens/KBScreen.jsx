import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";

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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Simulasi Metode KB</Text>

      <Text style={styles.label}>Status Menikah:</Text>
      <Picker
        selectedValue={statusMenikah}
        onValueChange={setStatusMenikah}
        style={styles.picker}
      >
        <Picker.Item label="Sudah" value="sudah" />
        <Picker.Item label="Belum" value="belum" />
      </Picker>

      <Text style={styles.label}>Ingin Punya Anak Lagi?</Text>
      <Picker
        selectedValue={inginAnak}
        onValueChange={setInginAnak}
        style={styles.picker}
      >
        <Picker.Item label="Tidak" value="tidak" />
        <Picker.Item label="Ya" value="ya" />
      </Picker>

      <Text style={styles.label}>Frekuensi Hubungan:</Text>
      <Picker
        selectedValue={frekuensi}
        onValueChange={setFrekuensi}
        style={styles.picker}
      >
        <Picker.Item label="Rutin" value="rutin" />
        <Picker.Item label="Kadang" value="kadang" />
        <Picker.Item label="Jarang" value="jarang" />
      </Picker>

      <Text style={styles.label}>Preferensi Metode:</Text>
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

      <Text style={styles.label}>Riwayat Kesehatan:</Text>
      <Picker
        selectedValue={riwayat}
        onValueChange={setRiwayat}
        style={styles.picker}
      >
        <Picker.Item label="Normal" value="normal" />
        <Picker.Item label="Menyusui" value="menyusui" />
        <Picker.Item label="Hipertensi / Risiko Lain" value="risiko" />
      </Picker>

      <View style={{ marginVertical: 20 }}>
        <Button title="Simulasikan" onPress={simulasikan} />
      </View>

      {hasil && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Rekomendasi:</Text>
          <Text style={styles.resultMethod}>{hasil.metode}</Text>
          <Text style={styles.resultDesc}>{hasil.penjelasan}</Text>
        </View>
      )}
    </ScrollView>
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
    marginBottom: 16,
  },
  label: {
    marginTop: 10,
    fontWeight: "500",
  },
  picker: {
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    color: "gray",
  },
  resultBox: {
    backgroundColor: "#f0f9f0",
    padding: 16,
    borderRadius: 8,
  },
  resultTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  resultMethod: {
    fontSize: 16,
    color: "#006400",
    marginBottom: 6,
  },
  resultDesc: {
    fontSize: 14,
    color: "#333",
  },
});
