import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, ENDPOINTS } from '../../constants/Config';

export default function NotificationSettings() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState({
        allowNotifications: true,
        emailNotifications: false,
        orderNotifications: true,
        generalNotifications: true
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            const res = await fetch(`${API_BASE_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.user) {
                setSettings({
                    allowNotifications: data.user.allowNotifications ?? true,
                    emailNotifications: data.user.emailNotifications ?? false,
                    orderNotifications: data.user.orderNotifications ?? true,
                    generalNotifications: data.user.generalNotifications ?? true,
                });
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Gagal mengambil pengaturan");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = await AsyncStorage.getItem("userToken");
            const res = await fetch(`${API_BASE_URL}/profile/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                Alert.alert("Sukses", "Pengaturan berhasil disimpan");
                router.back();
            } else {
                Alert.alert("Error", "Gagal menyimpan pengaturan");
            }
        } catch (error) {
            Alert.alert("Error", "Terjadi kesalahan jaringan");
        } finally {
            setSaving(false);
        }
    };

    const toggleSwitch = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6CC51D" />
            </View>
        );
    }