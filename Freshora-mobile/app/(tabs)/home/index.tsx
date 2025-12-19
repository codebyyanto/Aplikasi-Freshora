// Import React dan hook state
import React, { useState } from "react";

// Import komponen UI dari React Native
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";

// Safe area agar tidak bentrok notch / status bar
import { SafeAreaView } from "react-native-safe-area-context";

// Import icon
import { Ionicons } from "@expo/vector-icons";

// Import routing dan lifecycle focus
import { useRouter, useFocusEffect } from "expo-router";

// Import AsyncStorage untuk penyimpanan lokal
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ambil lebar layar untuk layout grid
const { width } = Dimensions.get("window");

// Mapping nama file image dari API ke asset lokal
const IMAGE_MAP: Record<string, any> = {
  "peach.png": require("../../../assets/images/products/peach.png"),
  "avocado.png": require("../../../assets/images/products/avocado.png"),
  "pineapple.png": require("../../../assets/images/products/pineapple.png"),
  "grapes.png": require("../../../assets/images/products/grapes.png"),
  "pomegranate.png": require("../../../assets/images/products/pomegranate.png"),
  "broccoli.png": require("../../../assets/images/products/broccoli.png"),

  // Fallback jika image tidak ditemukan
  default: require("../../../assets/images/products/peach.png"),
};

// Mapping icon kategori berdasarkan nama kategori dari API
const CATEGORY_ICONS: Record<string, any> = {
  Vegetables: require("../../../assets/categories_icons/vegetables.png"),
  Buah: require("../../../assets/categories_icons/fruits.png"),
  Minuman: require("../../../assets/categories_icons/drinks.png"),
  Kebutuhan: require("../../../assets/categories_icons/groceries.png"),
  "Minyak nabati": require("../../../assets/categories_icons/oil.png"),

  // Fallback icon
  default: require("../../../assets/categories_icons/vegetables.png"),
};
// Import konfigurasi API
import { API_BASE_URL, ENDPOINTS } from "../../../constants/Config";

export default function Home() {
  const router = useRouter();

  // State daftar produk
  const [products, setProducts] = useState<any[]>([]);

  // State daftar kategori
  const [categories, setCategories] = useState<any[]>([]);

  // State daftar favorit
  const [favorites, setFavorites] = useState<any[]>([]);

  // Akan dijalankan setiap kali halaman Home difokuskan
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      loadFavorites();
    }, [])
  );

  // Mengambil data favorit dari AsyncStorage
  const loadFavorites = async () => {
    try {
      const json = await AsyncStorage.getItem("userFavorites");
      if (json) {
        setFavorites(JSON.parse(json));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Menambah / menghapus produk dari favorit
  const toggleFavorite = async (product: any) => {
    try {
      let newFavs = [...favorites];
      const exists = newFavs.find((f) => f.id === product.id);

      if (exists) {
        newFavs = newFavs.filter((f) => f.id !== product.id);
      } else {
        newFavs.push(product);
      }

      setFavorites(newFavs);
      await AsyncStorage.setItem("userFavorites", JSON.stringify(newFavs));
    } catch (error) {
      console.error(error);
    }
  };

  // Mengambil data produk dan kategori dari API
  const fetchData = async () => {
    try {
      // Fetch produk
      const prodRes = await fetch(`${API_BASE_URL}${ENDPOINTS.PRODUCTS}`);
      const prodData = await prodRes.json();
      if (prodData?.products) {
        setProducts(prodData.products);
      }

      // Fetch kategori
      const catRes = await fetch(`${API_BASE_URL}${ENDPOINTS.CATEGORIES}`);
      const catData = await catRes.json();
      if (catData?.categories) {
        setCategories(catData.categories);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/*SEARCH BAR */}
      {/* Digunakan untuk input pencarian produk (UI saja) */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#999" />

          <TextInput
            placeholder="Search keywords..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />

          <Ionicons name="options-outline" size={20} color="#333" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/*BANNER PROMO*/}
        <View style={styles.bannerContainer}>
          <Image
            source={require("../../../assets/images/banner/banner-promo.png")}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerTextOverlay}>
            <Text style={styles.bannerTitle}>
              20% off on your first purchase
            </Text>
          </View>
        </View>

        {/*KATEGORI */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kategori</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>

        {/* List kategori horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {categories.map((cat, index) => {
            // Ambil icon kategori berdasarkan nama dari API
            const iconSource =
              CATEGORY_ICONS[cat.name] || CATEGORY_ICONS["default"];

            return (
              <View
                key={cat.id}
                style={[
                  styles.categoryItem,
                  index === 0 && { marginLeft: 20 },
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    index === 0
                      ? { backgroundColor: "#E9F8E3" }
                      : { backgroundColor: "#F3F5F7" },
                  ]}
                >
                  <Image source={iconSource} style={styles.categoryIcon} />
                </View>

                <Text style={styles.categoryName}>{cat.name}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/*PRODUK UNGGULAN*/}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Produk unggulan</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>

        <View style={styles.productsGrid}>
          {products.map((prod) => {
            // Mapping image dari API ke asset lokal
            const imageSource =
              prod.image && IMAGE_MAP[prod.image]
                ? IMAGE_MAP[prod.image]
                : IMAGE_MAP["default"];

            // Cek status favorit
            const isFav = favorites.some((f) => f.id === prod.id);

            return (
              <TouchableOpacity
                key={prod.id}
                style={styles.productCard}
                activeOpacity={0.9}
                onPress={() => router.push(`/product/${prod.id}`)}
              >
                {/* ICON FAVORIT */}
                <TouchableOpacity
                  style={styles.favIcon}
                  onPress={() => toggleFavorite(prod)}
                >
                  <Ionicons
                    name={isFav ? "heart" : "heart-outline"}
                    size={18}
                    color={isFav ? "#FF5252" : "#999"}
                  />
                </TouchableOpacity>

                <View style={styles.productImageContainer}>
                  <Image
                    source={imageSource}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                </View>

                <Text style={styles.productPrice}>
                  Rp {Number(prod.price).toLocaleString("id-ID")}
                </Text>

                <Text style={styles.productName} numberOfLines={1}>
                  {prod.name}
                </Text>

                <Text style={styles.productWeight}>1 kg</Text>

                {/* ADD TO CART */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.addToCartBtn}
                    onPress={async () => {
                      const token = await AsyncStorage.getItem("userToken");
                      if (!token) {
                        alert("Harap login terlebih dahulu");
                        router.push("/login");
                        return;
                      }

                      await fetch(`${API_BASE_URL}${ENDPOINTS.CART}`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          productId: prod.id,
                          quantity: 1,
                        }),
                      });

                      alert("Berhasil masuk keranjang!");
                    }}
                  >
                    <Ionicons name="bag-handle-outline" size={16} color="#6CC51D" />
                    <Text style={styles.btnText}>Add to cart</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 10,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
    backgroundColor: "#fff",
    zIndex: 10,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#F6F7FB", // Light grey
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: "center",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 14,
    color: "#333",
  },
  bannerContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 15,
    overflow: "hidden",
    height: 160, // Pendek
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerTextOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    padding: 20,
    justifyContent: "center",
    width: "60%", // Limit text width
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111", // Text color on banner
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  categoriesScroll: {
    marginBottom: 25,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  categoryName: {
    fontSize: 12,
    color: "#666",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  productCard: {
    width: (width - 45) / 2, // 2 column with margins
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    padding: 10,
    // Shadow light
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0"
  },
  badgeNew: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#FFEDD5", // Light orange
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1
  },
  badgeDiscount: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#FFE2E2", // Light red
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#F57C00" // Orange text
  },
  favIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1
  },
  productImageContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  productImage: {
    width: 80,
    height: 80,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6CC51D", // Green price
    marginBottom: 2,
    textAlign: "center"
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 2
  },
  productWeight: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 10
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    paddingTop: 8
  },
  addToCartBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  btnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginLeft: 5
  }
});
