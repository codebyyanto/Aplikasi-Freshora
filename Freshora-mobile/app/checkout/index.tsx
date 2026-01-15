import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Image,
    Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, ENDPOINTS } from "../../constants/Config";

export default function CheckoutScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [showAddressList, setShowAddressList] = useState(false);

    const fetchData = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) return;

            // Fetch Cart
            const cartRes = await fetch(`${API_BASE_URL}${ENDPOINTS.CART}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const cartData = await cartRes.json();

            if (cartData.items) {
                const mapped = cartData.items.map((item: any) => ({
                    id: item.id,
                    productId: item.productId,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    image: item.product.image
                }));
                setCartItems(mapped);
            } else {
                setCartItems([]);
            }

            // Fetch Addresses
            const profileRes = await fetch(`${API_BASE_URL}${ENDPOINTS.PROFILE}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const profileData = await profileRes.json();

            if (profileData.user && profileData.user.addresses) {
                const addrs = profileData.user.addresses;
                setAddresses(addrs);

                // Select default or first address
                const def = addrs.find((a: any) => a.isDefault);
                if (def) {
                    setSelectedAddressId(def.id);
                } else if (addrs.length > 0) {
                    setSelectedAddressId(addrs[0].id);
                }
            }

        } catch (error) {
            console.error("Error fetching checkout data:", error);
            Alert.alert("Error", "Gagal memuat data checkout");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const handleCreateOrder = async () => {
        if (!selectedAddressId) {
            Alert.alert("Error", "Silakan pilih alamat pengiriman terlebih dahulu");
            return;
        }

        if (cartItems.length === 0) {
            Alert.alert("Error", "Keranjang belanja kosong");
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
                    items: cartItems,
                    addressId: selectedAddressId
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
            Alert.alert("Error", "Terjadi kesalahan koneksi");
        } finally {
            setSubmitting(false);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 5000;
    const total = subtotal + shipping;

    const selectedAddress = addresses.find(a => a.id === selectedAddressId);

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
                <Text style={styles.title}>Konfirmasi Pesanan</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Section Alamat */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Alamat Pengiriman</Text>

                    {addresses.length === 0 ? (
                        <TouchableOpacity style={styles.addAddressBtn} onPress={() => router.push("/addresses/form")}>
                            <Ionicons name="add-circle-outline" size={24} color="#6CC51D" />
                            <Text style={styles.addAddressText}>Tambah Alamat Baru</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.addressCard}>
                            <View style={styles.addressHeader}>
                                <Ionicons name="location" size={20} color="#6CC51D" />
                                <Text style={styles.recipientName}>{selectedAddress?.recipientName || selectedAddress?.label}</Text>
                            </View>
                            <Text style={styles.addressText}>{selectedAddress?.street}</Text>
                            <Text style={styles.addressText}>{selectedAddress?.city}, {selectedAddress?.postal}</Text>
                            <Text style={styles.phoneText}>{selectedAddress?.phoneNumber}</Text>

                            <TouchableOpacity
                                style={styles.changeAddressBtn}
                                onPress={() => setShowAddressList(!showAddressList)}
                            >
                                <Text style={styles.changeAddressText}>
                                    {showAddressList ? "Tutup Pilihan" : "Ganti Alamat"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Dropdown Selection */}
                    {showAddressList && (
                        <View style={styles.addressList}>
                            {addresses.map(addr => (
                                <TouchableOpacity
                                    key={addr.id}
                                    style={[
                                        styles.addressOption,
                                        selectedAddressId === addr.id && styles.selectedOption
                                    ]}
                                    onPress={() => {
                                        setSelectedAddressId(addr.id);
                                        setShowAddressList(false);
                                    }}
                                >
                                    <View style={styles.radioOuter}>
                                        {selectedAddressId === addr.id && <View style={styles.radioInner} />}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.optionTitle}>{addr.recipientName || addr.label}</Text>
                                        <Text style={styles.optionText} numberOfLines={1}>{addr.street}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={styles.addNewOption}
                                onPress={() => router.push("/addresses/form")}
                            >
                                <Ionicons name="add" size={20} color="#6CC51D" />
                                <Text style={styles.addNewText}>Tambah Alamat Lain</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Section Items */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ringkasan Barang</Text>
                    {cartItems.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemQty}>{item.quantity} x Rp {item.price.toLocaleString("id-ID")}</Text>
                            </View>
                            <Text style={styles.itemTotal}>
                                Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Section Payment Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Rincian Pembayaran</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal Produk</Text>
                        <Text style={styles.summaryValue}>Rp {subtotal.toLocaleString("id-ID")}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Ongkos Kirim</Text>
                        <Text style={styles.summaryValue}>Rp {shipping.toLocaleString("id-ID")}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Total Pembayaran</Text>
                        <Text style={styles.totalValue}>Rp {total.toLocaleString("id-ID")}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.orderBtn,
                        (submitting || !selectedAddressId) && styles.disabledBtn
                    ]}
                    onPress={handleCreateOrder}
                    disabled={submitting || !selectedAddressId}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.orderBtnText}>Buat Pesanan</Text>
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
    scrollContent: { padding: 20, paddingBottom: 100 },
    section: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4
    },
    sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 15 },

    // Address Styles
    addAddressBtn: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderWidth: 1,
        borderColor: "#6CC51D",
        borderRadius: 12,
        borderStyle: "dashed",
        justifyContent: "center"
    },
    addAddressText: { color: "#6CC51D", fontWeight: "bold", marginLeft: 10 },
    addressCard: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 12,
        padding: 15
    },
    addressHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    recipientName: { fontSize: 16, fontWeight: "bold", marginLeft: 8, color: "#333" },
    addressText: { color: "#666", fontSize: 14, marginBottom: 2 },
    phoneText: { color: "#333", fontSize: 14, marginTop: 5 },
    changeAddressBtn: { alignSelf: "flex-end", marginTop: 10 },
    changeAddressText: { color: "#6CC51D", fontWeight: "bold", fontSize: 14 },

    // Address List Dropdown
    addressList: { marginTop: 10 },
    addressOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0"
    },
    selectedOption: { backgroundColor: "#F9FFF5" },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#6CC51D",
        marginRight: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#6CC51D"
    },
    optionTitle: { fontWeight: "bold", color: "#333" },
    optionText: { color: "#666", fontSize: 12 },
    addNewOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        justifyContent: "center"
    },
    addNewText: { color: "#6CC51D", fontWeight: "bold", marginLeft: 5 },

    // Item Styles
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f9f9f9",
        paddingBottom: 12
    },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 14, color: "#333", fontWeight: "500" },
    itemQty: { fontSize: 12, color: "#999", marginTop: 2 },
    itemTotal: { fontSize: 14, color: "#333", fontWeight: "bold" },

    // Summary Styles
    summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    summaryLabel: { color: "#666", fontSize: 14 },
    summaryValue: { color: "#333", fontSize: 14, fontWeight: "500" },
    divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
    totalLabel: { fontSize: 16, fontWeight: "bold", color: "#333" },
    totalValue: { fontSize: 18, fontWeight: "bold", color: "#6CC51D" },

    // Footer
    footer: {
        padding: 20,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#eee"
    },
    orderBtn: {
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
    disabledBtn: { backgroundColor: "#ccc", shadowOpacity: 0 },
    orderBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});
