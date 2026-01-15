import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Image,
    Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, ENDPOINTS } from "../../constants/Config";

export default function CheckoutScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [showAddressList, setShowAddressList] = useState(false);

    const fetchData = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) return;

            // Fetch Cart
            const cartRes = await fetch(`${API_BASE_URL}${ENDPOINTS.CART}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const cartData = await cartRes.json();

            if (cartData.items) {
                const mapped = cartData.items.map((item: any) => ({
                    id: item.id,
                    productId: item.productId,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    image: item.product.image
                }));
                setCartItems(mapped);
            } else {
                setCartItems([]);
            }

            // Fetch Addresses
            const profileRes = await fetch(`${API_BASE_URL}${ENDPOINTS.PROFILE}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const profileData = await profileRes.json();

            if (profileData.user && profileData.user.addresses) {
                const addrs = profileData.user.addresses;
                setAddresses(addrs);

                // Select default or first address
                const def = addrs.find((a: any) => a.isDefault);
                if (def) {
                    setSelectedAddressId(def.id);
                } else if (addrs.length > 0) {
                    setSelectedAddressId(addrs[0].id);
                }
            }
        } catch (error) {
            console.error("Error fetching checkout data:", error);
            Alert.alert("Error", "Gagal memuat data checkout");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const handleCreateOrder = async () => {
        if (!selectedAddressId) {
            Alert.alert("Error", "Silakan pilih alamat pengiriman terlebih dahulu");
            return;
        }

        if (cartItems.length === 0) {
            Alert.alert("Error", "Keranjang belanja kosong");
            return;
        }

        setSubmitting(true);
        try {
            const token = await AsyncStorage.getItem("userToken");
            const res = await fetch(`${API_BASE_URL}${ENDPOINTS.ORDERS}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cartItems,
                    addressId: selectedAddressId
                })
            });

            const data = await res.json();

            if (res.ok) {
                Alert.alert("Sukses", "Pesanan berhasil dibuat!", [
                    { text: "Lihat Pesanan", onPress: () => router.replace("/orders") }
                ]);
            } else {
                Alert.alert("Gagal", data.message || "Gagal membuat pesanan");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Terjadi kesalahan koneksi");
        } finally {
            setSubmitting(false);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 5000;
    const total = subtotal + shipping;

    const selectedAddress = addresses.find(a => a.id === selectedAddressId);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6CC51D" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Konfirmasi Pesanan</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}></ScrollView>