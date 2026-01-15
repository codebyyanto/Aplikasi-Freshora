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