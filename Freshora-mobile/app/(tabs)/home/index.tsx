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
// Import konfigurasi API
import { API_BASE_URL, ENDPOINTS } from "../../../constants/Config";

export default function Home() {
  const router = useRouter();

  // State daftar produk
  const [products, setProducts] = useState<any[]>([]);

  // State daftar kategori
  const [categories, setCategories] = useState<any[]>([]);

  // State daftar favorit
  const [favorites, setFavorites] = useState<any[]>([]);

  // Akan dijalankan setiap kali halaman Home difokuskan
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      loadFavorites();
    }, [])
  );

  // Mengambil data favorit dari AsyncStorage
  const loadFavorites = async () => {
    try {
      const json = await AsyncStorage.getItem("userFavorites");
      if (json) {
        setFavorites(JSON.parse(json));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Menambah / menghapus produk dari favorit
  const toggleFavorite = async (product: any) => {
    try {
      let newFavs = [...favorites];
      const exists = newFavs.find((f) => f.id === product.id);

      if (exists) {
        newFavs = newFavs.filter((f) => f.id !== product.id);
      } else {
        newFavs.push(product);
      }

      setFavorites(newFavs);
      await AsyncStorage.setItem("userFavorites", JSON.stringify(newFavs));
    } catch (error) {
      console.error(error);
    }
  };

  // Mengambil data produk dan kategori dari API
  const fetchData = async () => {
    try {
      // Fetch produk
      const prodRes = await fetch(`${API_BASE_URL}${ENDPOINTS.PRODUCTS}`);
      const prodData = await prodRes.json();
      if (prodData?.products) {
        setProducts(prodData.products);
      }

      // Fetch kategori
      const catRes = await fetch(`${API_BASE_URL}${ENDPOINTS.CATEGORIES}`);
      const catData = await catRes.json();
      if (catData?.categories) {
        setCategories(catData.categories);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* ================= SEARCH BAR ================= */}
      {/* Digunakan untuk input pencarian produk (UI saja) */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#999" />

          <TextInput
            placeholder="Search keywords..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />

          <Ionicons name="options-outline" size={20} color="#333" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ================= BANNER PROMO ================= */}
        {/* Banner promosi statis */}
        <View style={styles.bannerContainer}>
          <Image
            source={require("../../../assets/images/banner/banner-promo.png")}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerTextOverlay}>
            <Text style={styles.bannerTitle}>
              20% off on your first purchase
            </Text>
          </View>
        </View>

