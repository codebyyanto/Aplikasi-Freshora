// Import React dan hook state
import React, { useState } from "react";

// Import komponen UI dari React Native
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";

// Safe area agar tidak bentrok notch / status bar
import { SafeAreaView } from "react-native-safe-area-context";

// Import icon
import { Ionicons } from "@expo/vector-icons";

// Import routing dan lifecycle focus
import { useRouter, useFocusEffect } from "expo-router";

// Import AsyncStorage untuk penyimpanan lokal
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ambil lebar layar untuk layout grid
const { width } = Dimensions.get("window");

// Mapping nama file image dari API ke asset lokal
const IMAGE_MAP: Record<string, any> = {
  "peach.png": require("../../../assets/images/products/peach.png"),
  "avocado.png": require("../../../assets/images/products/avocado.png"),
  "pineapple.png": require("../../../assets/images/products/pineapple.png"),
  "grapes.png": require("../../../assets/images/products/grapes.png"),
  "pomegranate.png": require("../../../assets/images/products/pomegranate.png"),
  "broccoli.png": require("../../../assets/images/products/broccoli.png"),

  // Fallback jika image tidak ditemukan
  default: require("../../../assets/images/products/peach.png"),
};

// Mapping icon kategori berdasarkan nama kategori dari API
const CATEGORY_ICONS: Record<string, any> = {
  Vegetables: require("../../../assets/images/categories/vegetables.png"),
  Buah: require("../../../assets/images/categories/fruits.png"),
  Minuman: require("../../../assets/images/categories/drinks.png"),
  Kebutuhan: require("../../../assets/images/categories/needs.png"),
  "Minyak nabati": require("../../../assets/images/categories/oil.png"),

  // Fallback icon
  default: require("../../../assets/images/categories/vegetables.png"),
};
