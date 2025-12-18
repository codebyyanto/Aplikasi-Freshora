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
