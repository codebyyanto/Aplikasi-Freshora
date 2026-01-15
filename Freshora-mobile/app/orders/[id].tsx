import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, ENDPOINTS, STATUS_TRANSLATION } from "../../constants/Config";

export default function OrderDetail() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}${ENDPOINTS.ORDERS}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            if (res.ok) {
                setOrder(data);
            }
        } catch (error) {
            console.error("Fetch Order Detail Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6CC51D" />
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Pesanan tidak ditemukan</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* TOP BAR */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Detail Pesanan #{order.id}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* STATUS & DATE CARD */}
                <View style={styles.card}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.label}>Status</Text>
                        <Text style={styles.statusValue}>{STATUS_TRANSLATION[order.status] || order.status}</Text>
                    </View>
                    <View style={[styles.rowBetween, { marginTop: 8 }]}>
                        <Text style={styles.label}>Tanggal</Text>
                        <Text style={styles.value}>
                            {new Date(order.createdAt).toLocaleDateString("id-ID", {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </Text>
                    </View>
                </View>

                {/* ADDRESS CARD */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Alamat Pengiriman</Text>
                    <View style={styles.divider} />
                    <Text style={styles.addressLabel}>{order.address.label}</Text>
                    <Text style={styles.addressText}>{order.address.street}</Text>
                    <Text style={styles.addressText}>
                        {order.address.city}, {order.address.postal}
                    </Text>
                </View>

                {/* ITEMS LIST */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Daftar Produk</Text>
                    <View style={styles.divider} />

                    {order.items.map((item: any, index: number) => (
                        <View key={index} style={styles.itemContainer}>
                            {item.product.image ? (
                                <Image
                                    source={{ uri: item.product.image }}
                                    style={styles.itemImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={[styles.itemImage, styles.placeholderImage]}>
                                    <Ionicons name="image-outline" size={24} color="#ccc" />
                                </View>
                            )}

                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
                                <Text style={styles.itemQty}>{item.quantity} x Rp {item.price.toLocaleString("id-ID")}</Text>
                            </View>
                            <Text style={styles.itemTotal}>
                                Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* SUMMARY CARD */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Rincian Pembayaran</Text>
                    <View style={styles.divider} />
                    <View style={styles.rowBetween}>
                        <Text style={styles.label}>Total Harga</Text>
                        <Text style={styles.totalPrice}>Rp {Number(order.total).toLocaleString("id-ID")}</Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9FC",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F7F9FC",
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        paddingTop: 50,
        backgroundColor: "#fff",
        elevation: 2,
    },
    backBtn: {
        marginRight: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    errorText: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
        marginTop: 50,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    divider: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 10,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        fontSize: 14,
        color: "#666",
    },
    value: {
        fontSize: 14,
        color: "#333",
        fontWeight: "500",
    },
    statusValue: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#6CC51D",
        textTransform: "capitalize",
    },
    addressLabel: {
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    addressText: {
        color: "#666",
        fontSize: 14,
        lineHeight: 20,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: "#f5f5f5",
    },
    placeholderImage: {
        justifyContent: "center",
        alignItems: "center",
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        color: "#333",
        fontWeight: "500",
        marginBottom: 4,
    },
    itemQty: {
        fontSize: 12,
        color: "#888",
    },
    itemTotal: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#6CC51D",
    },
});
