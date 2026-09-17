import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { NextBestAction } from "../types";
import { fetchNextBestActions } from "../services/api";

export default function CommandCenterScreen() {
  const [actions, setActions] = useState<NextBestAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    setLoading(true);
    const data = await fetchNextBestActions();
    setActions(data);
    setLoading(false);
  };

  const markActionDone = (id: string) => {
    setActions(actions.map(a => a.id === id ? { ...a, status: "done" } : a));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Platform Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerSubtitle}>YUSUF OS · PRIVATE COMMAND CENTER</Text>
        <Text style={styles.bannerTitle}>Focus on Leverage & Execution</Text>
        <Text style={styles.bannerMotto}>"Build. Serve. Grow. Give."</Text>
      </View>

      {/* 6 Core Pillars Snapshot */}
      <Text style={styles.sectionHeader}>Personal Value Index (PVI)</Text>
      <View style={styles.grid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>85%</Text>
          <Text style={styles.metricLabel}>Capability</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>78%</Text>
          <Text style={styles.metricLabel}>Proof</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>70%</Text>
          <Text style={styles.metricLabel}>Distribution</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>64%</Text>
          <Text style={styles.metricLabel}>Network</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>82%</Text>
          <Text style={styles.metricLabel}>Commercial</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>75%</Text>
          <Text style={styles.metricLabel}>Ownership</Text>
        </View>
      </View>

      {/* Next Best Actions Section */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionHeader}>🎯 Next Best Actions (AI Ranked)</Text>
        <TouchableOpacity onPress={loadActions}>
          <Text style={styles.refreshLink}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#38bdf8" style={{ marginTop: 20 }} />
      ) : (
        actions.map((action) => {
          const isDone = action.status === "done";
          return (
            <View key={action.id} style={[styles.actionCard, isDone && styles.actionCardDone]}>
              <View style={styles.actionHeader}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{action.priorityRank}</Text>
                </View>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreText}>Impact: {action.impactScore}/10</Text>
                  <Text style={styles.scoreDivider}>•</Text>
                  <Text style={styles.scoreText}>{action.effortMinutes}m</Text>
                </View>
              </View>

              <Text style={[styles.actionTitle, isDone && styles.textStrike]}>
                {action.title}
              </Text>
              <Text style={styles.actionReason}>{action.reason}</Text>

              <TouchableOpacity
                style={[styles.actionBtn, isDone ? styles.actionBtnDone : styles.actionBtnActive]}
                onPress={() => markActionDone(action.id)}
                disabled={isDone}
              >
                <Text style={styles.actionBtnText}>
                  {isDone ? "✓ Selesai" : "Eksekusi Sekarang"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })
      )}

      {/* 90-Day Sprint Progress */}
      <Text style={styles.sectionHeader}>Sprint 90 Hari Aktif</Text>
      <View style={styles.sprintCard}>
        <View style={styles.sprintRow}>
          <Text style={styles.sprintTitle}>Sprint Q3: Platform Scale & Commercialization</Text>
          <Text style={styles.sprintDays}>Tersisa 18 Hari</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: "68%" }]} />
        </View>
        <Text style={styles.sprintFooter}>68% selesai • 5 OKRs aktif • 14 tasks tersisa</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d16",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  banner: {
    backgroundColor: "#111827",
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 20,
  },
  bannerSubtitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#38bdf8",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 4,
  },
  bannerMotto: {
    fontSize: 12,
    color: "#94a3b8",
    fontStyle: "italic",
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: "600",
    color: "#cbd5e1",
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  refreshLink: {
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metricCard: {
    width: "31%",
    backgroundColor: "#111827",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1e293b",
    alignItems: "center",
    marginBottom: 8,
  },
  metricValue: {
    color: "#38bdf8",
    fontSize: 16,
    fontWeight: "700",
  },
  metricLabel: {
    color: "#94a3b8",
    fontSize: 10,
    marginTop: 2,
  },
  actionCard: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 10,
  },
  actionCardDone: {
    opacity: 0.5,
    borderColor: "#10b981",
  },
  actionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  rankBadge: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rankText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreText: {
    color: "#94a3b8",
    fontSize: 11,
  },
  scoreDivider: {
    color: "#64748b",
    marginHorizontal: 4,
  },
  actionTitle: {
    color: "#f1f5f9",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  textStrike: {
    textDecorationLine: "line-through",
    color: "#64748b",
  },
  actionReason: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 10,
  },
  actionBtn: {
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  actionBtnActive: {
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#38bdf8",
  },
  actionBtnDone: {
    backgroundColor: "#064e3b",
  },
  actionBtnText: {
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: "600",
  },
  sprintCard: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  sprintRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sprintTitle: {
    color: "#f1f5f9",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  sprintDays: {
    color: "#eab308",
    fontSize: 11,
    fontWeight: "600",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#1e293b",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#38bdf8",
  },
  sprintFooter: {
    color: "#64748b",
    fontSize: 11,
  },
});
