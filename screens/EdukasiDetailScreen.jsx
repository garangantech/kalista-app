import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function EdukasiDetailScreen({ route }) {
  const { item } = route.params;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text style={styles.title}>{item.title}</Text>

      {item.content.map((section, index) => (
        <View key={index} style={styles.section}>
          {section.heading ? (
            <Text style={styles.heading}>{section.heading}</Text>
          ) : null}

          {Array.isArray(section.body) ? (
            section.body.map((point, i) => (
              <Text key={i} style={styles.bodyText}>
                • {point}
              </Text>
            ))
          ) : (
            <Text style={styles.bodyText}>{section.body}</Text>
          )}
        </View>
      ))}
    </ScrollView>
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
  },
  section: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  bodyText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 4,
  },
});
