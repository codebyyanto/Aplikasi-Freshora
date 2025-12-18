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
