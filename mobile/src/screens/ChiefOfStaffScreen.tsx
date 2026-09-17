import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ChatMessage } from "../types";
import { askChiefOfStaff } from "../services/api";

const QUICK_PROMPTS = [
  "Prioritas eksekusi hari ini?",
  "Review progres Sprint 90 hari",
  "Trik optimasi cashflow bisnis",
  "Rekomendasi bukti proyek untuk portfolio",
];

export default function ChiefOfStaffScreen() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "chief",
      text: "Halo Yusuf! Saya AI Chief of Staff Anda. Berpegang pada prinsip *'Build. Serve. Grow. Give.'*, apa tantangan strategis atau keputusan yang ingin kita selesaikan hari ini?",
      timestamp: "Sekarang",
    },
  ]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputText("");
    setLoading(true);

    try {
      const reply = await askChiefOfStaff(textToSend);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "chief",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "chief",
        text: "Terjadi kesalahan saat berkomunikasi dengan AI Chief of Staff.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🧠 AI Chief of Staff</Text>
        <Text style={styles.headerSubtitle}>
          Strategic Decision Support · Private & Grounded in Yusuf OS
        </Text>
      </View>

      {/* Suggestion Chips */}
      <View style={styles.chipsContainer}>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.chip}
            onPress={() => handleSend(prompt)}
            disabled={loading}
          >
            <Text style={styles.chipText}>{prompt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => {
          const isUser = item.sender === "user";
          return (
            <View
              style={[
                styles.bubbleContainer,
                isUser ? styles.bubbleUserContainer : styles.bubbleAiContainer,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  isUser ? styles.bubbleUser : styles.bubbleAi,
                ]}
              >
                <Text style={[styles.messageText, isUser ? styles.textUser : styles.textAi]}>
                  {item.text}
                </Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            </View>
          );
        }}
      />

      {/* Input Row */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Tanya Chief of Staff..."
          placeholderTextColor="#64748b"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!inputText.trim() || loading) && styles.sendBtnDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.sendBtnText}>Kirim</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d16",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f8fafc",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
  },
  chip: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  chipText: {
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: "500",
  },
  messageList: {
    padding: 16,
    paddingBottom: 20,
  },
  bubbleContainer: {
    marginBottom: 12,
    flexDirection: "row",
  },
  bubbleUserContainer: {
    justifyContent: "flex-end",
  },
  bubbleAiContainer: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 12,
  },
  bubbleUser: {
    backgroundColor: "#2563eb",
    borderBottomRightRadius: 2,
  },
  bubbleAi: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  textUser: {
    color: "#ffffff",
  },
  textAi: {
    color: "#e2e8f0",
  },
  timestamp: {
    fontSize: 10,
    color: "#94a3b8",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputBar: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    backgroundColor: "#0d131f",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#111827",
    color: "#f8fafc",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1e293b",
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 13,
  },
});
