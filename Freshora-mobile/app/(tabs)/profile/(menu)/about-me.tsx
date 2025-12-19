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