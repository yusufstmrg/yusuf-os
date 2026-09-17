import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import QuickCaptureScreen from "./src/screens/QuickCaptureScreen";
import CommandCenterScreen from "./src/screens/CommandCenterScreen";
import ChiefOfStaffScreen from "./src/screens/ChiefOfStaffScreen";

type Tab = "capture" | "command" | "chief";

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>("command");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />

      {/* Main Content Screen */}
      <View style={styles.container}>
        {currentTab === "command" && <CommandCenterScreen />}
        {currentTab === "capture" && <QuickCaptureScreen />}
        {currentTab === "chief" && <ChiefOfStaffScreen />}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, currentTab === "command" && styles.tabItemActive]}
          onPress={() => setCurrentTab("command")}
        >
          <Text style={styles.tabIcon}>📊</Text>
          <Text style={[styles.tabLabel, currentTab === "command" && styles.tabLabelActive]}>
            Command
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, currentTab === "capture" && styles.tabItemActive]}
          onPress={() => setCurrentTab("capture")}
        >
          <Text style={styles.tabIcon}>⚡</Text>
          <Text style={[styles.tabLabel, currentTab === "capture" && styles.tabLabelActive]}>
            Capture
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, currentTab === "chief" && styles.tabItemActive]}
          onPress={() => setCurrentTab("chief")}
        >
          <Text style={styles.tabIcon}>🧠</Text>
          <Text style={[styles.tabLabel, currentTab === "chief" && styles.tabLabelActive]}>
            Chief of Staff
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#090d16",
  },
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#0d131f",
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    paddingVertical: 8,
    paddingBottom: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  tabItemActive: {
    borderTopColor: "#38bdf8",
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "500",
  },
  tabLabelActive: {
    color: "#38bdf8",
    fontWeight: "700",
  },
});
