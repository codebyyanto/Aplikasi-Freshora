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

            if (res.ok) {
                Alert.alert("Sukses", "Pesanan berhasil dibuat!", [
                    { text: "Lihat Pesanan", onPress: () => router.replace("/orders") }
                ]);
            } else {
                Alert.alert("Gagal", data.message || "Gagal membuat pesanan");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Gagal menghubungi server");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Metode Pembayaran</Text>
            </View>

            {/* Stepper (Visual Only) */}
            <View style={styles.stepperContainer}>
                <View style={[styles.stepDot, styles.stepActive]}><Ionicons name="checkmark" size={14} color="#fff" /></View>
                <View style={[styles.stepLine, styles.stepActive]} />
                <View style={[styles.stepDot, styles.stepActive]}><Ionicons name="checkmark" size={14} color="#fff" /></View>
                <View style={[styles.stepLine, styles.stepActive]} />
                <View style={[styles.stepDot, styles.stepActive]}><Text style={styles.stepNum}>3</Text></View>
            </View>
            <View style={styles.stepperLabels}>
                <Text style={styles.stepLabel}>Keranjang</Text>
                <Text style={styles.stepLabel}>Alamat</Text>
                <Text style={[styles.stepLabel, styles.labelActive]}>Bayar</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Pilih Metode Pembayaran</Text>

                {PAYMENT_METHODS.map((method) => {
                    const isSelected = selectedMethod === method.id;
                    return (
                        <TouchableOpacity
                            key={method.id}
                            style={[
                                styles.methodCard,
                                isSelected && styles.methodCardSelected
                            ]}
                            onPress={() => setSelectedMethod(method.id)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.methodHeader}>
                                <View style={[
                                    styles.iconContainer,
                                    isSelected ? { backgroundColor: "#6CC51D" } : { backgroundColor: "#F0F0F0" }
                                ]}>
                                    <Ionicons
                                        name={method.icon as any}
                                        size={24}
                                        color={isSelected ? "#fff" : "#666"}
                                    />
                                </View>
                                <View style={styles.methodInfo}>
                                    <Text style={[styles.methodName, isSelected && styles.textSelected]}>
                                        {method.name}
                                    </Text>
                                    <Text style={styles.methodDesc}>{method.description}</Text>
                                </View>
                                <View style={styles.radioOuter}>
                                    {isSelected && <View style={styles.radioInner} />}
                                </View>
                            </View>