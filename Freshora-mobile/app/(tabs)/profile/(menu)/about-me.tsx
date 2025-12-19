import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Stack, Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, ENDPOINTS } from "../../../../constants/Config";

export default function AboutMe() {
    const router = useRouter();
    const [user, setUser] = useState({
        name: "User",
        email: "user@example.com",
        phone: "+62 812 3456 7890",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (token) {

                const res = await fetch(`${API_BASE_URL}${ENDPOINTS.ME}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();

                if (res.ok && data.user) {
                    setUser({
                        name: data.user.name,
                        email: data.user.email,
                        phone: data.user.phone || "+62 812 3456 7890",
                    });
                }
            }

        } catch (e) {
            console.error("Profile fetch error", e);
        }
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <Tabs.Screen options={{ tabBarStyle: { display: "none" }, href: null }} />

            <View style={styles.container}>
                {/* Custom Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.replace("/(tabs)/profile")} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Tentang Saya</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.sectionTitle}>Detail Tentang Saya</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
                            <Text style={styles.text}>{user.name}</Text>
                        </View>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
                            <Text style={styles.text}>{user.email}</Text>
                        </View>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Ionicons name="call-outline" size={20} color="#888" style={styles.icon} />
                            <Text style={styles.text}>{user.phone}</Text>
                        </View>
                    </View>

                </ScrollView>