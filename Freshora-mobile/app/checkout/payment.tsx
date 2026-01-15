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

                            {/* Extra Input (e.g. GoPay Number) */}
                            {isSelected && method.requiresInput && (
                                <View style={styles.extraInputContainer}>
                                    <Text style={styles.inputLabel}>{method.inputLabel}</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={method.inputPlaceholder}
                                        keyboardType="phone-pad"
                                        value={extraInput}
                                        onChangeText={setExtraInput}
                                    />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.payBtn, (submitting || !selectedMethod) && styles.disabledBtn]}
                    onPress={handlePayment}
                    disabled={submitting || !selectedMethod}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.payBtnText}>Bayar Sekarang</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff"
    },
    backBtn: { padding: 5, marginRight: 10 },
    headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },

    // Stepper
    stepperContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10
    },
    stepDot: {
        width: 24, height: 24, borderRadius: 12,
        backgroundColor: "#ccc",
        justifyContent: "center", alignItems: "center"
    },
    stepLine: {
        width: 60, height: 2, backgroundColor: "#ccc"
    },
    stepActive: { backgroundColor: "#6CC51D" },
    stepNum: { color: "#fff", fontSize: 12, fontWeight: "bold" },
    stepperLabels: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 5,
        marginBottom: 20,
    },
    stepLabel: {
        fontSize: 12, color: "#999", width: 85, textAlign: "center"
    },
    labelActive: { color: "#6CC51D", fontWeight: "bold" },

    content: {
        padding: 20
    },
    sectionTitle: {
        fontSize: 16, fontWeight: "bold", marginBottom: 15, color: "#333"
    },

    // Cards
    methodCard: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        backgroundColor: "#fff"
    },
    methodCardSelected: {
        borderColor: "#6CC51D",
        backgroundColor: "#F9FFF5"
    },
    methodHeader: {
        flexDirection: "row",
        alignItems: "center"
    },
    iconContainer: {
        width: 48, height: 48, borderRadius: 24,
        justifyContent: "center", alignItems: "center",
        marginRight: 15
    },
    methodInfo: { flex: 1 },
    methodName: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4 },
    textSelected: { color: "#6CC51D" },
    methodDesc: { fontSize: 12, color: "#888", lineHeight: 18 },

    // Radio
    radioOuter: {
        width: 20, height: 20, borderRadius: 10,
        borderWidth: 2, borderColor: "#ccc",
        marginLeft: 10, justifyContent: "center", alignItems: "center"
    },
    radioInner: {
        width: 10, height: 10, borderRadius: 5, backgroundColor: "#6CC51D"
    },

    // Extra Input
    extraInputContainer: {
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingTop: 15
    },
    inputLabel: {
        fontSize: 12, color: "#666", marginBottom: 8, fontWeight: "bold"
    },
    textInput: {
        borderWidth: 1, borderColor: "#ddd", borderRadius: 8,
        paddingHorizontal: 15, paddingVertical: 10,
        fontSize: 14, color: "#333", backgroundColor: "#fff"
    },

    // Footer
    footer: {
        padding: 20,
        borderTopWidth: 1, borderTopColor: "#eee"
    },
    payBtn: {
        backgroundColor: "#6CC51D",
        paddingVertical: 16, borderRadius: 12,
        alignItems: "center",
        shadowColor: "#6CC51D", shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 5, elevation: 5
    },
    disabledBtn: { backgroundColor: "#ccc", shadowOpacity: 0 },
    payBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});