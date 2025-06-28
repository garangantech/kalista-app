import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import edukasiData from "../data/edukasi.json";

const imageMap = {
  "1.png": require("../assets/img-education/1.png"),
  "2.png": require("../assets/img-education/2.png"),
  "default.png": require("../assets/pregnant.png"), // optional fallback
};

export default function EdukasiScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("EdukasiDetail", { item })}
    >
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.summary}>{item.summary}</Text>
        </View>

        <View style={styles.imageWrapper}>
          <Image
            source={
              imageMap[item.image] || require("../assets/img-education/1.png")
            }
            style={styles.image}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={edukasiData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  imageWrapper: {
    width: 80,
    height: 80,
    marginLeft: 12,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#ddd",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  category: {
    fontSize: 12,
    color: "#fe61ad",
    fontWeight: "600",
    marginBottom: 4,
  },

  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },

  summary: {
    fontSize: 13,
    color: "#555",
  },
});
