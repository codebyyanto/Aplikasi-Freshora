// Import React dan hooks
import React, { useEffect, useState } from "react";

// Import komponen UI
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity
} from "react-native";

// Import icon
import { Ionicons } from "@expo/vector-icons";

// Import router
import { useRouter } from "expo-router";

// Import AsyncStorage untuk token
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import konfigurasi API
import { API_BASE_URL, ENDPOINTS } from "../../constants/Config";

export default function OrderHistory() {
    const router = useRouter();

    // State daftar pesanan
    const [orders, setOrders] = useState<any[]>([]);

    // State loading
    const [loading, setLoading] = useState(true);

    export default function OrderHistory() {
        const router = useRouter();

        // State daftar pesanan
        const [orders, setOrders] = useState<any[]>([]);

        // State loading
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            fetchOrders();
        }, []);

        // Mengambil data order dari API
        const fetchOrders = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken");
                if (!token) return;

                const res = await fetch(
                    `${API_BASE_URL}${ENDPOINTS.ORDERS}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await res.json();

                if (res.ok && data.orders) {
                    setOrders(data.orders);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        // Render setiap item pesanan
        const renderItem = ({ item }: { item: any }) => (
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.orderId}>
                        Order #{item.id}
                    </Text>
                    <Text style={styles.status}>
                        {item.status}
                    </Text>
                </View>

                <Text style={styles.date}>
                    {new Date(item.createdAt).toLocaleDateString()}
                </Text>

                <View style={styles.divider} />

                <View style={styles.footer}>
                    <Text style={styles.totalPrice}>
                        Total: Rp {Number(item.total).toLocaleString("id-ID")}
                    </Text>
                </View>
            </View>
        );

        return (
            <View style={styles.container}>

                {/*TOP BAR */}
                <View style={styles.topBar}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backBtn}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color="#333"
                        />
                    </TouchableOpacity>

                    <Text style={styles.title}>
                        Riwayat Pesanan
                    </Text>
                </View>

                {loading ? (
                    // Loading indicator
                    <ActivityIndicator
                        size="large"
                        color="#6CC51D"
                        style={{ marginTop: 50 }}
                    />
                ) : (
                    <FlatList
                        data={orders}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={renderItem}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={
                            <View style={styles.empty}>
                                <Text style={styles.emptyText}>
                                    Belum ada pesanan
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>
        );
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#F7F9FC"
        },
        topBar: {
            flexDirection: "row",
            alignItems: "center",
            padding: 20,
            paddingTop: 50,
            backgroundColor: "#fff",
            elevation: 2
        },
        backBtn: {
            marginRight: 15
        },
        title: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#333"
        },
        list: {
            padding: 20
        },
        card: {
            backgroundColor: "#fff",
            padding: 15,
            borderRadius: 12,
            marginBottom: 15,
            elevation: 1
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5
        },
        orderId: {
            fontWeight: "bold",
            fontSize: 16
        },
        status: {
            color: "#6CC51D",
            fontWeight: "bold"
        },
        date: {
            color: "#888",
            fontSize: 12,
            marginBottom: 10
        },
        divider: {
            height: 1,
            backgroundColor: "#eee",
            marginVertical: 10
        },
        footer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
        },
        totalPrice: {
            fontWeight: "bold",
            fontSize: 16,
            color: "#333"
        },
        empty: {
            alignItems: "center",
            marginTop: 50
        },
        emptyText: {
            color: "#999"
        }
    });
