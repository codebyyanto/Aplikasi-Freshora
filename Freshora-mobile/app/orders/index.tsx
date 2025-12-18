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
