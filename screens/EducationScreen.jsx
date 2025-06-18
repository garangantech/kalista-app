import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EducationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edukasi Kesehatan</Text>
      <Text>Daftar artikel akan ditampilkan di sini.</Text>
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
    marginBottom: 10,
  },
});
