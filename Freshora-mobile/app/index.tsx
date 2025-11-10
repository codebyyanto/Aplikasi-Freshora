// Import library dan komponen yang dibutuhkan
import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Swiper from "react-native-swiper"; // untuk membuat slide onboarding
import { LinearGradient } from "expo-linear-gradient"; // efek gradasi tombol
import { useRouter } from "expo-router"; // navigasi antar halaman

// Ambil ukuran layar perangkat
const { width, height } = Dimensions.get("window");
