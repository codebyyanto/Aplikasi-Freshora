// Import React dan hooks yang dibutuhkan
import React, { useEffect, useState } from "react";

// Import komponen UI dari React Native
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";

// Import ikon dari Expo
import { Ionicons } from "@expo/vector-icons";

// Import routing dan parameter URL dari Expo Router
import { useLocalSearchParams, useRouter } from "expo-router";

// Komponen halaman Detail Produk
export default function ProductDetail() {

    // Mengambil parameter id produk dari URL
    const { id } = useLocalSearchParams();

    // State untuk menyimpan data produk
    const [product, setProduct] = useState<any>(null);

    // State untuk menyimpan jumlah (quantity) produk
    const [qty, setQty] = useState(1);

    // Router untuk navigasi halaman
    const router = useRouter();
