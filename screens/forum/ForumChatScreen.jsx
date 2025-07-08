import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  BackHandler,
} from "react-native";
import axios from "../../services/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function ForumChatScreen() {
  const [forum, setForum] = useState(null);
  const [replies, setReplies] = useState([]);
  const [message, setMessage] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const getToken = async () => await AsyncStorage.getItem("@token");

  const fetchForum = async () => {
    try {
      const token = await getToken();
      const res = await axios.get("/forum/my-questions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const latest = res.data.data.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      )[0];

      setForum(latest || null);

      if (latest?.status === "handled") {
        fetchReplies(latest.id);
      } else {
        setReplies([]);
      }
    } catch (err) {
      console.log("❌ Gagal fetch forum:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (forumId) => {
    try {
      const token = await getToken();
      const res = await axios.get(`/forum/${forumId}/replies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReplies(res.data.data);
    } catch (err) {
      console.log("❌ Gagal fetch replies:", err);
    }
  };

  const sendReply = async () => {
    if (!message.trim()) return;
    try {
      const token = await getToken();
      await axios.post(
        "/forum/reply",
        { question_id: forum.id, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("");
      setTimeout(() => fetchReplies(forum.id), 500);
    } catch (err) {
      console.log("❌ Gagal kirim pesan:", err);
    }
  };

  const sendQuestion = async () => {
    if (!newQuestion.trim()) return Alert.alert("Isi pertanyaan dulu!");
    try {
      const token = await getToken();
      await axios.post(
        "/forum",
        { title: newQuestion },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewQuestion("");
      setTimeout(() => fetchForum(), 1000);
    } catch (err) {
      console.log("❌ Gagal kirim pertanyaan:", err);
    }
  };

  useEffect(() => {
    fetchForum();
    const polling = setInterval(fetchForum, 3000);
    return () => clearInterval(polling);
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fe61ad" />
      </View>
    );
  }

  const isClosed = forum?.status === "closed";
  const isHandled = forum?.status === "handled";

  // 🟡 Form pertanyaan baru
  if (!forum || isClosed) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Tanya Perawat</Text>
        </View>

        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            {forum
              ? "Forum sebelumnya telah ditutup.\nAjukan pertanyaan baru jika dibutuhkan."
              : "Kamu belum mengirim pertanyaan.\nTulis pertanyaan kamu di bawah."}
          </Text>

          <TextInput
            placeholder="Tulis pertanyaan kamu di sini..."
            value={newQuestion}
            onChangeText={setNewQuestion}
            style={styles.inputNewForum}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            onPress={sendQuestion}
            style={styles.sendButtonFull}
          >
            <Text style={styles.sendText}>Kirim Pertanyaan</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // ✅ Forum aktif (open / handled)
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {forum.status === "open"
            ? "⏳ Menunggu perawat..."
            : `🩺 Ditangani oleh: ${forum.handled_by?.name || "Perawat"}`}
        </Text>
      </View>

      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={{ paddingBottom: 90 + insets.bottom }}
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* Chat Pertama: Pertanyaan Awal */}
        {forum.title && (
          <View style={[styles.bubble, styles.right]}>
            <Text style={styles.sender}>Kamu</Text>
            <Text style={styles.message}>{forum.title}</Text>
            <Text style={styles.timestamp}>(Pertanyaan awal)</Text>
          </View>
        )}

        {/* Balasan chat */}
        {replies.map((reply, index) => (
          <View
            key={index}
            style={[
              styles.bubble,
              reply.sender_role === "user" ? styles.right : styles.left,
            ]}
          >
            <Text style={styles.sender}>{reply.sender_name}</Text>
            <Text style={styles.message}>{reply.message}</Text>
            <Text style={styles.timestamp}>{reply.timestamp}</Text>
          </View>
        ))}
      </ScrollView>

      {isHandled && (
        <View
          style={[
            styles.inputContainer,
            { paddingBottom: insets.bottom || 10 },
          ]}
        >
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Tulis pesan..."
            style={styles.input}
            multiline
          />
          <TouchableOpacity onPress={sendReply} style={styles.sendButton}>
            <Text style={styles.sendText}>Kirim</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff0f5",
    borderBottomWidth: 1,
    borderBottomColor: "#fe61ad30",
  },
  headerText: { color: "#fe61ad", fontWeight: "bold" },
  chatContainer: { flex: 1, padding: 16 },
  bubble: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
    marginBottom: 10,
    backgroundColor: "#f2f2f2",
  },
  left: { alignSelf: "flex-start", backgroundColor: "#fff0f5" },
  right: { alignSelf: "flex-end", backgroundColor: "#dcf8c6" },
  sender: { fontWeight: "bold", marginBottom: 4 },
  message: { fontSize: 15 },
  timestamp: { fontSize: 11, color: "#999", marginTop: 4 },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f7f7f7",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#fe61ad",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },

  inputNewForum: {
    width: "100%",
    height: 120,
    backgroundColor: "#f7f7f7",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    marginBottom: 20,
  },

  sendButtonFull: {
    backgroundColor: "#fe61ad",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: "stretch",
    alignItems: "center",
  },
});
