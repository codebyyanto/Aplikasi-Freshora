import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Switch,
    ScrollView,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../constants/Config";

export default function AddressForm() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const isEdit = !!params.id;

    const [form, setForm] = useState({
        recipientName: "",
        street: "",
        city: "",
        postal: "",
        country: "Indonesia",
        phoneNumber: "",
        isDefault: false,
        label: "Home" // Default label
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEdit);

    useEffect(() => {
        if (isEdit) {
            fetchAddressDetail();
        }
    }, []);

    const fetchAddressDetail = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            const res = await fetch(`${API_BASE_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok && data.user && data.user.addresses) {
                const addr = data.user.addresses.find((a: any) => a.id === Number(params.id));
                if (addr) {
                    setForm({
                        recipientName: addr.recipientName || "",
                        street: addr.street || "",
                        city: addr.city || "",
                        postal: addr.postal || "",
                        country: addr.country || "Indonesia",
                        phoneNumber: addr.phoneNumber || "",
                        isDefault: addr.isDefault || false,
                        label: addr.label || "Home"
                    });
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSave = async () => {
        if (!form.recipientName || !form.street || !form.city || !form.phoneNumber) {
            Alert.alert("Error", "Mohon lengkapi semua field bertanda *");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("userToken");
            const url = isEdit
                ? `${API_BASE_URL}/profile/address/${params.id}`
                : `${API_BASE_URL}/profile/address`;

            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (res.ok) {
                Alert.alert("Sukses", "Alamat berhasil disimpan", [
                    { text: "OK", onPress: () => router.back() }
                ]);
            } else {
                Alert.alert("Gagal", data.message || "Terjadi kesalahan");
            }
        } catch (error) {
            Alert.alert("Error", "Gagal menghubungi server");
        } finally {
            setLoading(false);
        }
    };