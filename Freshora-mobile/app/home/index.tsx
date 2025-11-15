import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Ambil ukuran layar perangkat
const { width } = Dimensions.get("window");

// style untuk komponen
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  searchRow: { flexDirection: "row", alignItems: "center" },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: { flex: 1, paddingVertical: 8, fontSize: 14 },
  filterBtn: {
    marginLeft: 10,
    backgroundColor: "#E9F8E3",
    padding: 8,
    borderRadius: 10,
  },
  bannerBox: {
    marginVertical: 15,
    borderRadius: 15,
    overflow: "hidden",
  },
  bannerImg: {
    width: "100%",
    height: 150,
    borderRadius: 15,
  },
  bannerText: {
    position: "absolute",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    top: 20,
    left: 20,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 8,
    color: "#333",
  },
  category: {
    alignItems: "center",
    marginRight: 15,
  },
  catIcon: { width: 50, height: 50, borderRadius: 25 },
  catText: { fontSize: 12, color: "#555", marginTop: 4 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  }