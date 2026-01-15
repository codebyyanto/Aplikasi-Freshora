import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
    RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, ENDPOINTS } from "../../constants/Config";

export default function AddressList() {
    const router = useRouter();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAddresses = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}${ENDPOINTS.PROFILE}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            if (res.ok && data.user) {
                setAddresses(data.user.addresses || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAddresses();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchAddresses();
    };

    const handleDelete = async (id: number) => {
        Alert.alert(
            "Hapus Alamat",
            "Apakah Anda yakin ingin menghapus alamat ini?",
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Hapus",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("userToken");
                            await fetch(`${API_BASE_URL}/profile/address/${id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            fetchAddresses();
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <Ionicons name="location-outline" size={24} color="#6CC51D" />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.name}>{item.recipientName || item.label}</Text>
                    {item.isDefault && (
                        <View style={styles.defaultTag}>
                            <Text style={styles.defaultText}>UTAMA</Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity onPress={() => router.push({ pathname: "/addresses/form", params: { id: item.id } })}>
                    <Ionicons name="create-outline" size={20} color="#666" />
                </TouchableOpacity>
            </View>

            <View style={styles.cardBody}>
                <Text style={styles.addressText}>{item.street}</Text>
                <Text style={styles.addressText}>{item.city}, {item.country} {item.postal}</Text>
                <Text style={styles.phoneText}>{item.phoneNumber}</Text>
            </View>

            <View style={styles.cardFooter}>
                {!item.isDefault && (
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                        <Text style={styles.deleteText}>Hapus</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Alamat Saya</Text>
                <TouchableOpacity onPress={() => router.push("/addresses/form")}>
                    <Ionicons name="add-circle-outline" size={28} color="#333" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#6CC51D" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={addresses}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6CC51D"]} />
                    }
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>Belum ada alamat tersimpan</Text>
                        </View>
                    }
                />
            )}

            <View style={styles.footerBtnContainer}>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => router.push("/addresses/form")}
                >
                    <Text style={styles.addBtnText}>Tambah Alamat Baru</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F9FC" },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        paddingTop: 50,
        backgroundColor: "#fff",
        elevation: 2,
    },
    backBtn: { padding: 5 },
    title: { fontSize: 18, fontWeight: "bold", color: "#333" },
    list: { padding: 20, paddingBottom: 100 },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        elevation: 1,
        borderWidth: 1,
        borderColor: "#f0f0f0"
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F0F9E8",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15
    },
    headerText: { flex: 1 },
    name: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4 },
    defaultTag: {
        backgroundColor: "#E8F5E9",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: "flex-start"
    },
    defaultText: { fontSize: 10, color: "#6CC51D", fontWeight: "bold" },
    cardBody: { marginLeft: 55 },
    addressText: { color: "#666", fontSize: 14, marginBottom: 2 },
    phoneText: { color: "#333", fontSize: 14, marginTop: 5, fontWeight: "500" },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f9f9f9',
        marginLeft: 55
    },
    deleteText: { color: "#FF3B30", fontSize: 12 },
    empty: { alignItems: "center", marginTop: 50 },
    emptyText: { color: "#999" },
    footerBtnContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#eee"
    },
    addBtn: {
        backgroundColor: "#6CC51D",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center"
    },
    addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});
