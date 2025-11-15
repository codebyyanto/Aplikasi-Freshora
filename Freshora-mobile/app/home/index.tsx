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

// Komponen utama halaman home
return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#777" />
          <TextInput
            placeholder="Search keywords.."
            placeholderTextColor="#999"
            style={styles.input}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={22} color="#6CC51D" />
        </TouchableOpacity>
      </View>

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
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
    overflow: "hidden",
    position: "relative",
  },
  productImg: {
    width: "100%",
    height: 120,
  },
  infoBox: { padding: 10 },
  price: { color: "#6CC51D", fontWeight: "bold" },
  name: { fontWeight: "600", fontSize: 14, color: "#333" },
  weight: { color: "#999", fontSize: 12 },
  cartBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#E9F8E3",
    borderRadius: 20,
    padding: 6,
  },
});