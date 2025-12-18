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