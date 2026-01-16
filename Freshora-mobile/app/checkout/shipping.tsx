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