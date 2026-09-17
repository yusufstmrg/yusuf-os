import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { QuickCaptureItem, CategoryType } from "../types";
import { triageNoteWithAI } from "../services/api";

const CATEGORY_COLORS: Record<CategoryType, string> = {
  task: "#3b82f6",
  goal: "#8b5cf6",
  idea: "#eab308",
  wealth: "#10b981",
  evidence: "#ec4899",
  note: "#64748b",
};

export default function QuickCaptureScreen() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [captures, setCaptures] = useState<QuickCaptureItem[]>([
    {
      id: "qc-demo-1",
      category: "task",
      title: "Deploy Vercel & Neon Database Migrations",
      summary: "Pastikan environment variables di-setup di dashboard produksi.",
      suggestedPriority: "high",
      nextAction: "Push git commit & trigger build",
      tags: ["devops", "platform"],
      createdAt: "10:30",
    },
    {
      id: "qc-demo-2",
      category: "wealth",
      title: "Review Kas Operasional Bulanan",
      summary: "Hitung alokasi dana darurat dan dividen bisnis.",
      suggestedPriority: "medium",
      nextAction: "Buka spreadsheet keuangan",
      tags: ["finance", "review"],
      createdAt: "09:15",
    },
  ]);

  const handleCapture = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const aiResult = await triageNoteWithAI(inputText);

      const newItem: QuickCaptureItem = {
        id: `qc-${Date.now()}`,
        category: (aiResult.category as CategoryType) || "note",
        title: aiResult.title || inputText.slice(0, 40),
        summary: aiResult.summary || inputText,
        suggestedPriority: aiResult.suggestedPriority || "medium",
        nextAction: aiResult.nextAction || "Proses di dashboard",
        tags: aiResult.tags || ["quick-capture"],
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setCaptures([newItem, ...captures]);
      setInputText("");
    } catch (err: any) {
      Alert.alert("Error", "Gagal menyimpan capture.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚡ Quick Capture</Text>
        <Text style={styles.headerSubtitle}>
          Tangkap ide, tugas, atau bukti instan. AI otomatis menata ke inbox.
        </Text>
      </View>

      {/* Input Box */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Tulis ide, tugas, transaksi, atau catatan..."
          placeholderTextColor="#64748b"
          multiline
          numberOfLines={3}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity
          style={[styles.captureButton, loading && styles.buttonDisabled]}
          onPress={handleCapture}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.captureButtonText}>✨ AI Triage & Simpan</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* List Captured Items */}
      <Text style={styles.sectionTitle}>Inbox Hari Ini ({captures.length})</Text>
      <FlatList
        data={captures}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: CATEGORY_COLORS[item.category] || "#64748b" },
                ]}
              >
                <Text style={styles.badgeText}>{item.category.toUpperCase()}</Text>
              </View>
              <Text style={styles.timeText}>{item.createdAt}</Text>
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSummary}>{item.summary}</Text>

            <View style={styles.nextActionContainer}>
              <Text style={styles.nextActionLabel}>Next Action:</Text>
              <Text style={styles.nextActionText}> {item.nextAction}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d16",
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8fafc",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 4,
  },
  inputContainer: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 20,
  },
  textInput: {
    color: "#f8fafc",
    fontSize: 15,
    minHeight: 60,
    textAlignVertical: "top",
  },
  captureButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  captureButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#cbd5e1",
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  timeText: {
    color: "#64748b",
    fontSize: 12,
  },
  cardTitle: {
    color: "#f1f5f9",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardSummary: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  nextActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    padding: 6,
    borderRadius: 6,
  },
  nextActionLabel: {
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: "600",
  },
  nextActionText: {
    color: "#e2e8f0",
    fontSize: 11,
    flex: 1,
  },
});
