import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../services/axiosInstance";
import { useNavigation } from "@react-navigation/native";

export default function ForumEntryRedirectPerawat() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const getToken = async () => await AsyncStorage.getItem("@token");

  useEffect(() => {
    const redirect = async () => {
      try {
        const token = await getToken();
        const res = await axios.get("/forum/questions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const myHandled = res.data.data.find(
          (f) => f.status === "handled" && f.handled_by
        );

        if (myHandled) {
          navigation.replace("ForumChatPerawat", { forum: myHandled });
        } else {
          navigation.replace("ForumListPerawat");
        }
      } catch (err) {
        console.log("❌ Gagal redirect:", err);
        Alert.alert("Error", "Gagal mengakses data forum.");
      } finally {
        setLoading(false);
      }
    };

    redirect();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fe61ad" />
      </View>
    );
  }

  return null;
}
