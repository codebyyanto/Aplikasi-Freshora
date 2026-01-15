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

    if (initialLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#6CC51D" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>{isEdit ? "Ubah Alamat" : "Tambah Alamat"}</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    { }
                    <View style={styles.inputGroup}>
                        <View style={styles.iconInput}>
                            <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Nama Penerima *"
                                value={form.recipientName}
                                onChangeText={(t) => setForm({ ...form, recipientName: t })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.iconInput}>
                            <Ionicons name="location-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Alamat Lengkap *"
                                value={form.street}
                                onChangeText={(t) => setForm({ ...form, street: t })}
                                multiline
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                            <View style={styles.iconInput}>
                                <Ionicons name="map-outline" size={20} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Kota *"
                                    value={form.city}
                                    onChangeText={(t) => setForm({ ...form, city: t })}
                                />
                            </View>
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <View style={styles.iconInput}>
                                <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Kode Pos"
                                    value={form.postal}
                                    keyboardType="numeric"
                                    onChangeText={(t) => setForm({ ...form, postal: t })}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.iconInput}>
                            <Ionicons name="globe-outline" size={20} color="#999" style={styles.inputIcon} />
                            <View style={styles.readOnlyInput}>
                                <Text style={{ color: "#333" }}>{form.country}</Text>
                                <Ionicons name="chevron-down" size={16} color="#ccc" />
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.iconInput}>
                            <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Nomor Telepon *"
                                value={form.phoneNumber}
                                keyboardType="phone-pad"
                                onChangeText={(t) => setForm({ ...form, phoneNumber: t })}
                            />
                        </View>
                    </View>

                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Jadikan Alamat Utama</Text>
                        <Switch
                            value={form.isDefault}
                            onValueChange={(v) => setForm({ ...form, isDefault: v })}
                            trackColor={{ false: "#eee", true: "#6CC51D" }}
                            thumbColor={"#fff"}
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveBtnText}>Simpan Alamat</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        paddingTop: 50,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0"
    },
    backBtn: { padding: 5 },
    title: { fontSize: 18, fontWeight: "bold", color: "#333" },
    scrollContent: { padding: 20 },

    inputGroup: { marginBottom: 15 },
    iconInput: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F7F9FC",
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 15, color: "#333" },
    readOnlyInput: { flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

    row: { flexDirection: "row" },

    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 30
    },
    switchLabel: { fontSize: 16, fontWeight: "500", color: "#333" },

    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#eee"
    },
    saveBtn: {
        backgroundColor: "#6CC51D",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#6CC51D",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5
    },
    saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});