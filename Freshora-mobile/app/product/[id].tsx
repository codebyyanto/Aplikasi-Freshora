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

    // Mengecek apakah produk favorit
    const checkFavorite = async () => {
        try {
            const json = await AsyncStorage.getItem("userFavorites");
            if (json) {
                const favs = JSON.parse(json);
                const exists = favs.some(
                    (f: any) => String(f.id) === String(id)
                );
                setIsFav(exists);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Toggle favorit
    const toggleFavorite = async () => {
        if (!product) return;

        try {
            const json = await AsyncStorage.getItem("userFavorites");
            let favs = json ? JSON.parse(json) : [];

            if (isFav) {
                favs = favs.filter(
                    (f: any) => String(f.id) !== String(id)
                );
                setIsFav(false);
            } else {
                favs.push(product);
                setIsFav(true);
            }

            await AsyncStorage.setItem(
                "userFavorites",
                JSON.stringify(favs)
            );
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddToCart = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                Alert.alert(
                    "Login Required",
                    "Silakan login untuk belanja",
                    [
                        { text: "Login", onPress: () => router.push("/login") },
                        { text: "Cancel", style: "cancel" }
                    ]
                );
                return;
            }

            const res = await fetch(
                `${API_BASE_URL}${ENDPOINTS.CART}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        productId: Number(id),
                        quantity: qty
                    })
                }
            );

            const data = await res.json();

            if (res.ok) {
                Alert.alert(
                    "Sukses",
                    "Produk berhasil masuk keranjang",
                    [
                        { text: "Lanjut Belanja", style: "cancel" },
                        {
                            text: "Lihat Keranjang",
                            onPress: () =>
                                router.push("/(tabs)/cart")
                        }
                    ]
                );
            } else {
                Alert.alert(
                    "Gagal",
                    data.message || "Gagal menambahkan ke keranjang"
                );
            }
        } catch (error) {
            console.error("Add to cart error:", error);
            Alert.alert("Error", "Terjadi kesalahan sistem");
        }
    };

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <ActivityIndicator size="large" color="#6CC51D" />
            </View>
        );
    }

    if (!product) return null;

    const imageSource =
        product.image && IMAGE_MAP[product.image]
            ? IMAGE_MAP[product.image]
            : IMAGE_MAP.default;

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.favBtn} onPress={toggleFavorite}>
                        <Ionicons name={isFav ? "heart" : "heart-outline"} size={24} color={isFav ? "#FF5252" : "#999"} />
                    </TouchableOpacity>

                    <Image source={imageSource} style={styles.image} resizeMode="contain" />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>{product.name}</Text>
                    <Text style={styles.price}>{formatCurrency(product.price)} / kg</Text>

                    <Text style={styles.description}>
                        {product.description || "Sayuran/Buah segar berkualitas tinggi langsung dari petani lokal. Dijamin segar dan sehat untuk keluarga Anda."}
                    </Text>

                    {/* Qty Selector */}
                    <View style={styles.qtyRow}>
                        <Text style={styles.qtyLabel}>Quantity</Text>
                        <View style={styles.qtyControl}>
                            <TouchableOpacity onPress={() => setQty(q => Math.max(1, q - 1))} style={styles.qtyBtn}>
                                <Ionicons name="remove" size={20} color="#6CC51D" />
                            </TouchableOpacity>
                            <Text style={styles.qtyValue}>{qty}</Text>
                            <TouchableOpacity onPress={() => setQty(q => q + 1)} style={styles.qtyBtn}>
                                <Ionicons name="add" size={20} color="#6CC51D" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Footer Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
                    <Text style={styles.btnText}>Masukan Keranjang — {formatCurrency(product.price * qty)}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}