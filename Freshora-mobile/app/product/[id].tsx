// Import React dan hooks
import React, { useEffect, useState } from "react";

// Import komponen UI
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert
} from "react-native";

// Import routing
import { useLocalSearchParams, useRouter } from "expo-router";

// Import icon
import { Ionicons } from "@expo/vector-icons";

// Import AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import konfigurasi API
import { API_BASE_URL, ENDPOINTS } from "../../constants/Config";

// Helper format rupiah
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(value);
};

// Mapping gambar produk lokal
const IMAGE_MAP: Record<string, any> = {
    "peach.png": require("../../assets/images/products/peach.png"),
    "avocado.png": require("../../assets/images/products/avocado.png"),
    "pineapple.png": require("../../assets/images/products/pineapple.png"),
    "grapes.png": require("../../assets/images/products/grapes.png"),
    "pomegranate.png": require("../../assets/images/products/pomegranate.png"),
    "broccoli.png": require("../../assets/images/products/broccoli.png"),
    default: require("../../assets/images/products/peach.png")
};

export default function ProductDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    // State data produk
    const [product, setProduct] = useState<any>(null);

    // State loading
    const [loading, setLoading] = useState(true);

    // State quantity
    const [qty, setQty] = useState(1);

    // State favorit
    const [isFav, setIsFav] = useState(false);

    useEffect(() => {
        fetchProductDetail();
        checkFavorite();
    }, [id]);

    // Fetch detail produk
    const fetchProductDetail = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}${ENDPOINTS.PRODUCTS}/${id}`
            );
            const data = await response.json();

            if (response.ok) {
                setProduct(data.product);
            } else {
                Alert.alert("Error", "Gagal memuat detail produk");
                router.back();
            }
        } catch (error) {
            console.error("Fetch detail error:", error);
            Alert.alert("Error", "Gagal terhubung ke server");
        } finally {
            setLoading(false);
        }
    };
