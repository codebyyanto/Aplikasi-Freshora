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

                {/* Footer */}
                {cartItems.length > 0 && (
                    <View style={styles.footer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal</Text>
                            <Text style={styles.summaryValue}>Rp {subtotal.toLocaleString("id-ID")}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Ongkos Kirim</Text>
                            <Text style={styles.summaryValue}>Rp {shipping.toLocaleString("id-ID")}</Text>
                        </View>
                        <View style={styles.divider} />

                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>Rp {Math.floor(total).toLocaleString("id-ID")}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.checkoutBtn}
                            onPress={handleCheckout}
                        >
                            <Text style={styles.checkoutText}>Checkout Sekarang</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 5 }} />
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9FC",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 25,
        marginTop: 0,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333"
    },
    headerCount: {
        fontSize: 14,
        color: "#6CC51D",
        fontWeight: "600"
    },
    flatList: {
        flex: 1
    },
    listContent: {
        padding: 20,
        paddingBottom: 20
    },
    footer: {
        padding: 30,
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 20,
        marginBottom: 60, // Clear the Tab Bar
    },
    cardContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    imageWrapper: {
        width: 70,
        height: 70,
        backgroundColor: "#F5F7FA",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15
    },
    image: {
        width: 50,
        height: 50,
    },
    infoContainer: {
        flex: 1,
        justifyContent: "center",
    },

    nameText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4
    },
    weightText: {
        color: "#999",
        fontSize: 12,
        marginBottom: 8
    },
    priceText: {
        color: "#6CC51D",
        fontSize: 15,
        fontWeight: "700"
    },
    qtyContainer: {
        alignItems: "center",
        justifyContent: "space-between",
        height: 80,
        backgroundColor: "#F9F9F9",
        borderRadius: 30, // Capsule shape
        paddingVertical: 5,
        width: 36,
    },
    qtyButton: {
        width: 28,
        height: 28,
        backgroundColor: "#fff",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    qtyText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    deleteButton: {
        backgroundColor: "#FF5252",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        marginBottom: 16,
        borderRadius: 16,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        height: 94, // Approx card height
        marginLeft: -10, // Pull closer
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    summaryLabel: { color: "#888", fontSize: 14 },
    summaryValue: { color: "#333", fontSize: 14, fontWeight: "600" },
    divider: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 12
    },
    totalLabel: { color: "#333", fontSize: 18, fontWeight: "bold" },
    totalValue: { color: "#333", fontSize: 20, fontWeight: "bold" },
    checkoutBtn: {
        backgroundColor: "#6CC51D",
        paddingVertical: 16,
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#6CC51D",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5
    },
    checkoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
        marginTop: 15,
        marginBottom: 20
    },
    shopNowBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#E9F8E3",
        borderRadius: 8
    },
    shopNowText: {
        color: "#6CC51D",
        fontWeight: "bold"
    }
});