import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Ambil ukuran layar perangkat
const { width } = Dimensions.get("window");

// Fungsi untuk mengambil data produk dari API
export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://192.168.100.10:4000/api/products");
        const data = await res.json();
        console.log("Response data:", data);

        // Tangani semua kemungkinan format respons
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.warn("Format data tidak sesuai, produk kosong:", data);
          setProducts([]);
        }
      } catch (err) {
        console.error("Gagal mengambil produk:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Komponen utama halaman home
  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#777" />
          <TextInput
            placeholder="Search keywords.."
            placeholderTextColor="#999"
            style={styles.input}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={22} color="#6CC51D" />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.bannerBox}>
        <Image
          source={require("../../../assets/banner.png")}
          style={styles.bannerImg}
        />
        <Text style={styles.bannerText}>20% off on your first purchase</Text>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Kategori</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { icon: require("../../../assets/icons/vegetables.png"), name: "Vegetables" },
          { icon: require("../../../assets/icons/fruits.png"), name: "Buah" },
          { icon: require("../../../assets/icons/drinks.png"), name: "Minuman" },
          { icon: require("../../../assets/icons/groceries.png"), name: "Kebutuhan" },
          { icon: require("../../../assets/icons/oil.png"), name: "Minyak nabati" },
        ].map((cat, index) => (
          <View key={index} style={styles.category}>
            <Image source={cat.icon} style={styles.catIcon} />
            <Text style={styles.catText}>{cat.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Products */}
      <Text style={styles.sectionTitle}>Produk unggulan</Text>
      {loading ? (
        <ActivityIndicator color="#6CC51D" size="large" />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {products.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => router.push(`/home/${item.id}`)}
              >
                <Image
                  source={{ uri: item.image || "#" }}
                  style={styles.productImg}
                />
                <View style={styles.infoBox}>
                  <Text style={styles.price}>Rp {item.price?.toLocaleString() || "0"}</Text>
                  <Text style={styles.name}>{item.name || "Produk Tanpa Nama"}</Text>
                  <Text style={styles.weight}>1.50 lbs</Text>
                </View>
                <TouchableOpacity style={styles.cartBtn}>
                  <Ionicons name="cart-outline" size={20} color="#6CC51D" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// style untuk komponen
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  searchRow: { flexDirection: "row", alignItems: "center" },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: { flex: 1, paddingVertical: 8, fontSize: 14 },
  filterBtn: {
    marginLeft: 10,
    backgroundColor: "#E9F8E3",
    padding: 8,
    borderRadius: 10,
  },
  bannerBox: {
    marginVertical: 15,
    borderRadius: 15,
    overflow: "hidden",
  },
  bannerImg: {
    width: "100%",
    height: 150,
    borderRadius: 15,
  },
  bannerText: {
    position: "absolute",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    top: 20,
    left: 20,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 8,
    color: "#333",
  },
  category: {
    alignItems: "center",
    marginRight: 15,
  },
  catIcon: { width: 50, height: 50, borderRadius: 25 },
  catText: { fontSize: 12, color: "#555", marginTop: 4 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
    overflow: "hidden",
    position: "relative",
  },
  productImg: {
    width: "100%",
    height: 120,
  },
  infoBox: { padding: 10 },
  price: { color: "#6CC51D", fontWeight: "bold" },
  name: { fontWeight: "600", fontSize: 14, color: "#333" },
  weight: { color: "#999", fontSize: 12 },
  cartBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#E9F8E3",
    borderRadius: 20,
    padding: 6,
  },
});