import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "../../services/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import "moment/locale/id";
import { Platform } from "react-native";
import { BackHandler } from "react-native";

export default function ForumListPerawatScreen() {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const getToken = async () => await AsyncStorage.getItem("@token");

  const fetchForums = async () => {
    try {
      const token = await getToken();
      const res = await axios.get("/forum/unhandled", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetch unhandled chat");

      setForums(res.data.data || []);
    } catch (err) {
      console.log("❌ Gagal ambil data forum:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForums();
  }, []);

  useEffect(() => {
    if (Platform.OS === "android") {
      const backAction = () => {
        navigation.navigate("MainTabs"); // arahkan ke tab utama
        return true; // cegah back default
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }
  }, []);

  const handleForum = async (forum) => {
    try {
      const token = await getToken();

      // 1. Tangani forum
      await axios.post(
        "/forum/handle",
        { forum_id: forum.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Ambil ulang forum yang sudah ditangani (dengan handled_by)
      const res = await axios.get("/forum/handled", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 3. Cari forum yang baru saja dihandle
      const updatedForum = res.data.data.find((f) => f.id === forum.id);

      if (!updatedForum) {
        console.log("⚠️ Forum tidak ditemukan setelah handle");
        return;
      }

      // 4. Navigasi ke screen chat dengan forum yang sudah update
      navigation.navigate("ForumChatPerawat", { forum: updatedForum });
    } catch (err) {
      console.log("❌ Gagal menangani forum:", err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.user?.name}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>
        {moment(item.created_at).locale("id").format("LLL")}
      </Text>
      <TouchableOpacity onPress={() => handleForum(item)} style={styles.button}>
        <Text style={styles.buttonText}>Tangani</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fe61ad" />
      </View>
    );
  }

  return forums.length === 0 ? (
    <View style={styles.center}>
      <Text style={{ color: "#666", fontSize: 16, textAlign: "center" }}>
        Belum ada forum yang perlu ditangani.
      </Text>
    </View>
  ) : (
    <FlatList
      data={forums}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff0f5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  name: { fontWeight: "bold", fontSize: 16 },
  title: { marginVertical: 6, fontSize: 14 },
  date: { fontSize: 12, color: "#666" },
  button: {
    backgroundColor: "#fe61ad",
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
