import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function EducationCard({ title, subtitle, category, image }) {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} resizeMode="cover" />
      <View style={styles.textContainer}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 130,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    // elevation: 4,
    height: "100%",
    marginLeft: "0.28%",
  },
  image: {
    width: "100%",
    height: "50%",
  },
  textContainer: {
    paddingVertical: "5%",
    backgroundColor: "#fff",
    paddingHorizontal: "10%",
  },
  category: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
});
