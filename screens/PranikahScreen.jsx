import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import JurnalPribadi from "./pranikah/JurnalPribadiScreen";
import RefleksiPasangan from "./pranikah/RefleksiPasanganScreen";
import TesKesiapan from "./pranikah/TesKesiapanScreen";

const quotes = [
  "Cinta itu memilih tiap hari, bukan sekali seumur hidup.",
  "Pernikahan yang sehat dimulai dari komunikasi yang jujur.",
  "Komitmen lebih dari sekadar kata-kata.",
  "Jangan menikah untuk menjadi bahagia, menikahlah untuk berbagi kebahagiaan.",
];

export default function PranikahScreen() {
  const [selected, setSelected] = useState("jurnal");
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <View style={styles.container}>
      <Text style={styles.quote}>"{randomQuote}"</Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() => setSelected("jurnal")}
          style={[
            styles.categoryButton,
            selected === "jurnal" && styles.selected,
          ]}
        >
          <Text style={styles.categoryText}>Jurnal Pribadi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelected("refleksi")}
          style={[
            styles.categoryButton,
            selected === "refleksi" && styles.selected,
          ]}
        >
          <Text style={styles.categoryText}>Refleksi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelected("tes")}
          style={[styles.categoryButton, selected === "tes" && styles.selected]}
        >
          <Text style={styles.categoryText}>Tes Kesiapan</Text>
        </TouchableOpacity>
      </View>

      {selected === "jurnal" && <JurnalPribadi />}
      {selected === "refleksi" && <RefleksiPasangan />}
      {selected === "tes" && <TesKesiapan />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  selected: {
    backgroundColor: "#fe61ad",
  },
  categoryText: {
    color: "#333",
    fontWeight: "600",
  },
  quote: {
    fontStyle: "italic",
    textAlign: "center",
    color: "#666",
    marginBottom: 12,
  },
});
