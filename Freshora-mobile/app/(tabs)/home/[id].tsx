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

    // Mengambil data produk dari API saat halaman dibuka
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(
                    `http://192.168.100.10:4000/api/products/${id}`
                );
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error("Gagal mengambil data produk:", error);
            }
        };

        fetchProduct();
    }, [id]);

    // Menampilkan loading jika data produk belum tersedia
    if (!product)
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#6CC51D" />
            </View>
        );

    return (
        <ScrollView style={styles.container}>

            {/* Tombol kembali ke halaman sebelumnya */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back-outline" size={26} color="#333" />
            </TouchableOpacity>

            {/* Gambar produk */}
            <Image source={{ uri: product.image }} style={styles.image} />

            <View style={styles.detailBox}>
                {/* Harga produk */}
                <Text style={styles.price}>
                    Rp {product?.price
                        ? Number(product.price).toLocaleString("id-ID")
                        : "0"}
                </Text>

                {/* Nama produk */}
                <Text style={styles.name}>{product.name}</Text>

                {/* Rating produk (sementara statis) */}
                <Text style={styles.rating}>⭐ 4.5 (89 reviews)</Text>

                {/* Deskripsi produk */}
                <Text style={styles.desc}>
                    {product.description ||
                        "Produk segar berkualitas terbaik dari Freshora setiap hari!"}
                </Text>
                <View style={styles.qtyRow}>
                    <Text style={styles.qtyLabel}>Quantity</Text>

                    <View style={styles.qtyBox}>
                        {/* Tombol mengurangi quantity (minimal 1) */}
                        <TouchableOpacity
                            onPress={() => setQty(Math.max(1, qty - 1))}
                            style={styles.qtyBtn}
                        >
                            <Ionicons name="remove" size={20} color="#6CC51D" />
                        </TouchableOpacity>

                        {/* Menampilkan jumlah quantity */}
                        <Text style={styles.qtyText}>{qty}</Text>

                        {/* Tombol menambah quantity */}
                        <TouchableOpacity
                            onPress={() => setQty(qty + 1)}
                            style={styles.qtyBtn}
                        >
                            <Ionicons name="add" size={20} color="#6CC51D" />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.addCartBtn}>
                    <Ionicons name="cart-outline" size={20} color="#fff" />
                    <Text style={styles.addCartText}>Add to cart</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
