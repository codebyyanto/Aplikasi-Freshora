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

// Data setiap slide onboarding
const slides = [
  {
    id: 1,
    title: "Dapatkan Diskon\nUntuk Semua Produk",
    desc: "Nikmati penawaran menarik setiap hari.\nSemua produk segar, harga makin hemat.",
    background: require("../assets/splash1.png"),
  },
  {
    id: 2,
    title: "Beli Buah\nBerkualitas Premium",
    desc: "Dapatkan buah segar pilihan terbaik.\nLangsung dari sumber terpercaya setiap hari.",
    background: require("../assets/splash2.png"),
  },
  {
    id: 3,
    title: "Beli Produk\nBerkualitas Setiap Hari",
    desc: "Semua produk dipilih dengan standar terbaik.\nAgar kamu bisa belanja dengan rasa yakin setiap hari.",
    background: require("../assets/splash3.png"),
  },
  {
    id: 4,
    title: "Selamat Datang di",
    brand: "FreshORA",
    desc: "Segar dalam genggaman.\nBelanja bahan makanan jadi simpel.",
    background: require("../assets/splash4.png"),
  },
];