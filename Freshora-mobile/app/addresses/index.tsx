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
    // ... logic akan ada di sini
}

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