// App.js
import React, { useEffect } from "react";
import { View, Button, StyleSheet } from "react-native";
import {
  requestPermissions,
  scheduleLocalNotification,
} from "./NotificationService";

export default function App() {
  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title="Tes Notifikasi Lokal"
        onPress={scheduleLocalNotification}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
