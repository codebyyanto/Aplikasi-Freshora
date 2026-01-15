import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    Image,
    TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, ENDPOINTS } from "../../constants/Config";
import { SafeAreaView } from "react-native-safe-area-context";

const PAYMENT_METHODS = [
    {
        id: "cod",
        name: "COD (Bayar di Tempat)",
        icon: "cash-outline",
        description: "Bayar tunai saat kurir sampai di lokasi Anda."
    },
    {
        id: "gopay",
        name: "GoPay",
        icon: "wallet-outline",
        description: "Hubungkan akun GoPay Anda untuk pembayaran instan.",
        requiresInput: true,
        inputLabel: "Nomor HP GoPay",
        inputPlaceholder: "0812xxxx"
    },
    {
        id: "bank_transfer",
        name: "Transfer Bank",
        icon: "card-outline",
        description: "Transfer manual ke rekening Virtual Account (BCA/Mandiri/BRI)."
    }
];

export default function PaymentScreen() {
    const router = useRouter();
    const { addressId, items } = useLocalSearchParams();

    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [extraInput, setExtraInput] = useState("");

    const handlePayment = async () => {
        if (!selectedMethod) {
            Alert.alert("Pilih Pembayaran", "Silakan pilih metode pembayaran terlebih dahulu.");
            return;
        }

        if (selectedMethod === 'gopay' && extraInput.length < 10) {
            Alert.alert("Input Kurang", "Masukkan nomor HP GoPay yang valid.");
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
                    addressId: Number(addressId),
                    paymentMethod: selectedMethod,
                })
            });

            const data = await res.json();