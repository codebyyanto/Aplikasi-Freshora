import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const SHIPPING_OPTIONS = [
    {
        id: "reguler",
        name: "Standar / Reguler",
        description: "Estimasi tiba 2 - 3 hari kerja",
        price: 10000,
        eta: "2-3 Hari"
    },
    {
        id: "next_day",
        name: "Next Day (Esok Sampai)",
        description: "Estimasi tiba besok",
        price: 20000,
        eta: "1 Hari"
    },
    {
        id: "instant",
        name: "Instant / Sameday",
        description: "Estimasi tiba dalam hitungan jam",
        price: 35000,
        eta: "3-6 Jam"
    },
    {
        id: "kargo",
        name: "Kargo (Trucking)",
        description: "Untuk barang berat / banyak",
        price: 25000,
        eta: "5-7 Hari"
    }
];

export default function ShippingScreen() {
    const router = useRouter();
    // Optional: could receive pre-selected ID via params if needed
    const { currentId } = useLocalSearchParams();

    const [selectedId, setSelectedId] = useState<string | null>(
        (currentId as string) || "reguler"
    );

    const handleSelect = () => {
        if (!selectedId) return;
        const selectedOption = SHIPPING_OPTIONS.find(o => o.id === selectedId);

        // Return to checkout with selected shipping data
        router.back();
        router.setParams({
            shippingId: selectedOption?.id,
            shippingName: selectedOption?.name,
            shippingPrice: selectedOption?.price?.toString()
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Pilih Pengiriman</Text>
            </View>

            {/* Stepper Visual (Optional, matching design style) */}
            <View style={styles.stepperContainer}>
                <View style={[styles.stepDot, styles.stepActive]}><Ionicons name="checkmark" size={14} color="#fff" /></View>
                <View style={[styles.stepLine, styles.stepActive]} />
                <View style={[styles.stepDot, styles.stepActive]}><Text style={styles.stepNum}>2</Text></View>
                <View style={styles.stepLine} />
                <View style={styles.stepDot}><Text style={styles.stepNum}>3</Text></View>
            </View>
            <View style={styles.stepperLabels}>
                <Text style={styles.stepLabel}>Anter Aja</Text>
                <Text style={[styles.stepLabel, styles.labelActive]}>Pengiriman</Text>
                <Text style={styles.stepLabel}>Bayar</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {SHIPPING_OPTIONS.map((option) => {
                    const isSelected = selectedId === option.id;
                    return (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.card,
                                isSelected && styles.cardSelected
                            ]}
                            onPress={() => setSelectedId(option.id)}
                            activeOpacity={0.9}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.optionName}>{option.name}</Text>
                                <Text style={styles.optionPrice}>Rp {option.price.toLocaleString("id-ID")}</Text>
                            </View>
                            <Text style={styles.optionDesc}>{option.description}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.btn} onPress={handleSelect}>
                    <Text style={styles.btnText}>Pilih Pengiriman</Text>
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
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0"
    },
    backBtn: { marginRight: 15 },
    title: { fontSize: 18, fontWeight: "bold", color: "#333" },

    // Stepper
    stepperContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
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