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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Notifications</Text>
                <View style={{ width: 24 }} />
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Allow Notifications */}
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Allow Notifications</Text>
                            <Text style={styles.desc}>Aktifkan semua notifikasi aplikasi</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#6CC51D" }}
                            thumbColor={"#f4f3f4"}
                            onValueChange={() => toggleSwitch('allowNotifications')}
                            value={settings.allowNotifications}
                        />
                    </View>
                </View>

                {/* Email Notifications */}
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Email Notifications</Text>
                            <Text style={styles.desc}>Terima berita & promo via email</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#6CC51D" }}
                            thumbColor={"#f4f3f4"}
                            onValueChange={() => toggleSwitch('emailNotifications')}
                            value={settings.emailNotifications}
                            disabled={!settings.allowNotifications}
                        />
                    </View>
                </View>
                {/* Order Notifications */}
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Order Notifications</Text>
                            <Text style={styles.desc}>Update status pesanan Anda</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#6CC51D" }}
                            thumbColor={"#f4f3f4"}
                            onValueChange={() => toggleSwitch('orderNotifications')}
                            value={settings.orderNotifications}
                            disabled={!settings.allowNotifications}
                        />
                    </View>
                </View>

                {/* General Notifications */}
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>General Notifications</Text>
                            <Text style={styles.desc}>Info umum dan update aplikasi</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#6CC51D" }}
                            thumbColor={"#f4f3f4"}
                            onValueChange={() => toggleSwitch('generalNotifications')}
                            value={settings.generalNotifications}
                            disabled={!settings.allowNotifications}
                        />
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveText}>Save settings</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F9FC" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        paddingTop: 50,
        backgroundColor: "#fff",
        elevation: 2,
    },
    backBtn: { padding: 5 },
    title: { fontSize: 18, fontWeight: "bold", color: "#333" },
    content: { padding: 20 },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    label: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 5 },
    desc: { fontSize: 12, color: "#888", maxWidth: '80%' },
    footer: {
        padding: 20,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#eee"
    },
    saveBtn: {
        backgroundColor: "#6CC51D",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#6CC51D",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5
    },
    saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});