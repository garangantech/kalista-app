import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Image
        source={require("../assets/logo-kalista.png")}
        style={styles.logo}
      /> */}

      <Text style={styles.title}>Tentang KALISTA</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>KALISTA</Text> (Kesehatan Anak & Wanita
        Indonesia) adalah aplikasi pendamping kesehatan yang membantu wanita dan
        keluarga Indonesia untuk memantau siklus haid, kehamilan, imunisasi
        anak, grafik tumbuh kembang, serta menyediakan edukasi penting seputar
        pranikah, KB, dan gaya hidup sehat.
      </Text>

      <Text style={styles.paragraph}>
        Aplikasi ini dirancang dengan cinta untuk mendukung perempuan dalam
        menjalani peran sebagai wanita, istri, dan ibu, dengan fitur-fitur yang
        ringan namun bermakna.
      </Text>

      <Text style={styles.sectionTitle}>Fitur Unggulan:</Text>
      <Text style={styles.list}>• Pelacak Haid & PMS</Text>
      <Text style={styles.list}>• Prediksi Masa Subur & HPL</Text>
      <Text style={styles.list}>• Jadwal Imunisasi Anak</Text>
      <Text style={styles.list}>• Grafik Tumbuh Kembang</Text>
      <Text style={styles.list}>• Simulasi KB</Text>
      <Text style={styles.list}>• Edukasi & Tips Pranikah</Text>

      <Text style={styles.sectionTitle}>Kontak & Dukungan</Text>
      <Text style={styles.paragraph}>
        Hubungi kami melalui email di:{" "}
        <Text style={styles.email}>support@kalista.id</Text>
      </Text>

      <Text style={styles.version}>Versi Aplikasi: 1.0.0</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fe61ad",
    marginBottom: 12,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 15,
    color: "#444",
    marginBottom: 14,
    textAlign: "justify",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fe61ad",
    marginTop: 16,
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  list: {
    fontSize: 14,
    color: "#333",
    alignSelf: "flex-start",
    marginLeft: 12,
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  email: {
    color: "#007AFF",
  },
  version: {
    marginTop: 24,
    fontSize: 12,
    color: "#aaa",
  },
});
