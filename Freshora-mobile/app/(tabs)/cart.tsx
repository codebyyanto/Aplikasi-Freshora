import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Alert,
    Dimensions,
    Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";

import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const IMAGE_MAP: Record<string, any> = {
    "peach.png": require("../../assets/images/products/peach.png"),
    "avocado.png": require("../../assets/images/products/avocado.png"),
    "pineapple.png": require("../../assets/images/products/pineapple.png"),
    "grapes.png": require("../../assets/images/products/grapes.png"),
    "pomegranate.png": require("../../assets/images/products/pomegranate.png"),
    "broccoli.png": require("../../assets/images/products/broccoli.png"),
    "default": require("../../assets/images/products/peach.png")
};

import { API_BASE_URL, ENDPOINTS } from "../../constants/Config";

export default function CartScreen() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Refresh cart every time the screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchCart();
        }, [])
    );

    const fetchCart = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CART}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.items) {
                const mapped = data.items.map((item: any) => ({
                    id: item.id,
                    productId: item.productId,
                    name: item.product.name,
                    price: item.product.price,
                    weight: "1 kg",
                    quantity: item.quantity,
                    image: item.product.image
                }));
                setCartItems(mapped);

            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) return;

            Alert.alert("Konfirmasi", `Total pembayaran adalah Rp ${Math.floor(subtotal + (cartItems.length > 0 ? 1.60 : 0)).toLocaleString("id-ID")}. Lanjutkan?`, [
                { text: "Batal", style: "cancel" },
                {
                    text: "Bayar", onPress: async () => {
                        try {
                            const res = await fetch(`${API_BASE_URL}${ENDPOINTS.ORDERS}`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`
                                },
                                body: JSON.stringify({ items: cartItems })
                            });

                            const data = await res.json();

                            if (res.ok) {
                                Alert.alert("Berhasil", "Pesanan Anda telah dibuat!");
                                setCartItems([]);
                                router.push("/orders");

                            } else {
                                Alert.alert("Gagal", data.message || "Gagal checkout");
                            }
                        } catch (e: any) {
                            Alert.alert("Error", e.message);
                        }
                    }
                }
            ]);

        } catch (error) {
            console.error("Checkout error:", error);
        }
    };

    const updateQuantity = async (id: number, quantity: number) => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            await fetch(`${API_BASE_URL}${ENDPOINTS.CART}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ quantity })
            });
            fetchCart();
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const handleIncrement = (item: any) => {
        updateQuantity(item.id, item.quantity + 1);
    };

    const handleDecrement = (item: any) => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.quantity - 1);
        } else {
            handleDelete(item.id);
        }
    };

    const handleDelete = (id: any) => {
        Alert.alert("Konfirmasi", "Hapus produk ini dari keranjang?", [
            { text: "Batal", style: "cancel" },
            {
                text: "Hapus", style: "destructive", onPress: async () => {
                    try {
                        const token = await AsyncStorage.getItem("userToken");
                        await fetch(`${API_BASE_URL}${ENDPOINTS.CART}/${id}`, {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        fetchCart();
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        ]);
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 5000;
    const total = subtotal + (cartItems.length > 0 ? shipping : 0);

    const renderRightActions = (id: any) => {
        return (
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(id)}
            >
                <Ionicons name="trash-outline" size={24} color="#fff" />
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item }: { item: any }) => {
        const imageSource = IMAGE_MAP[item.image] || IMAGE_MAP["default"];

        return (
            <Swipeable renderRightActions={() => renderRightActions(item.id)}>
                <View style={styles.cardContainer}>
                    <View style={styles.imageWrapper}>
                        <Image source={imageSource} style={styles.image} resizeMode="contain" />
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.nameText}>{item.name}</Text>
                        <Text style={styles.weightText}>{item.weight}</Text>
                        <Text style={styles.priceText}>Rp {Number(item.price * item.quantity).toLocaleString("id-ID")}</Text>
                    </View>

                    <View style={styles.qtyContainer}>
                        <TouchableOpacity onPress={() => handleDecrement(item)} style={styles.qtyButton}>
                            <Ionicons name="remove" size={16} color="#6CC51D" />
                        </TouchableOpacity>

                        <Text style={styles.qtyText}>{item.quantity}</Text>

                        <TouchableOpacity onPress={() => handleIncrement(item)} style={styles.qtyButton}>
                            <Ionicons name="add" size={16} color="#6CC51D" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Swipeable>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Keranjang Belanja</Text>
                    {cartItems.length > 0 && (
                        <Text style={styles.headerCount}>{cartItems.length} items</Text>
                    )}
                </View>

                {/* List */}
                <FlatList
                    data={cartItems}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    style={styles.flatList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="cart-outline" size={80} color="#DDD" />
                            <Text style={styles.emptyText}>Keranjang Anda masih kosong</Text>
                            <TouchableOpacity style={styles.shopNowBtn} onPress={() => router.push("/home")}>
                                <Text style={styles.shopNowText}>Mulai Belanja</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />