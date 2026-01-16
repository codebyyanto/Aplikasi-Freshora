// Import library dan komponen yang dibutuhkan
import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Swiper from "react-native-swiper"; // untuk membuat slide onboarding
import { LinearGradient } from "expo-linear-gradient"; // efek gradasi tombol
import { useRouter } from "expo-router"; // navigasi antar halaman

// Ambil ukuran layar perangkat
const { width, height } = Dimensions.get("window");

// Data setiap slide onboarding
const slides = [
  {
    id: 1,
    title: "Dapatkan Diskon\nUntuk Semua Produk",
    desc: "Nikmati penawaran menarik setiap hari.\nSemua produk segar, harga makin hemat.",
    background: require("../assets/splash1.png"),
  },
  {
    id: 2,
    title: "Beli Buah\nBerkualitas Premium",
    desc: "Dapatkan buah segar pilihan terbaik.\nLangsung dari sumber terpercaya setiap hari.",
    background: require("../assets/splash2.png"),
  },
  {
    id: 3,
    title: "Beli Produk\nBerkualitas Setiap Hari",
    desc: "Semua produk dipilih dengan standar terbaik.\nAgar kamu bisa belanja dengan rasa yakin setiap hari.",
    background: require("../assets/splash3.png"),
  },
  {
    id: 4,
    title: "Selamat Datang di",
    brand: "FreshORA",
    desc: "Segar dalam genggaman.\nBelanja bahan makanan jadi simpel.",
    background: require("../assets/splash4.png"),
  },
];

// Komponen utama onboarding
export default function Onboarding() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const token = await import("@react-native-async-storage/async-storage").then(
        (mod) => mod.default.getItem("userToken")
      );
      if (token) {
        // Jika ada token, langsung ke Home
        router.replace("/(tabs)/home");
      } else {
        // Jika tidak, tampilkan onboarding
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        {/* Bisa diganti dengan Splash Screen custom */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper
        loop={false}
        activeDotColor="#6CC51D"
        dotColor="#D9D9D9"
        paginationStyle={{ bottom: 80 }}
      >
        {/* looping setiap slide */}
        {slides.map((item, index) => (
          <ImageBackground
            key={item.id}
            source={item.background}
            style={styles.background}
            resizeMode="cover"
          >
            <View style={styles.darkOverlay} />

            <View style={styles.overlayContent}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                {item.brand && <Text style={styles.brand}>{item.brand}</Text>}
                <Text style={styles.desc}>{item.desc}</Text>
              </View>

              {index === slides.length - 1 && (
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => router.push("/login")} // pindah ke halaman login
                >
                  <LinearGradient
                    colors={["#7ED957", "#6CC51D"]}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Get started</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </ImageBackground>
        ))}
      </Swiper>
    </View>
  );
}

// Style tampilan
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width,
    height,
    justifyContent: "center",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(29, 28, 28, 0.21)",
  },
  overlayContent: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 100,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  brand: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#7ED957",
    textAlign: "center",
    marginTop: 5,
  },
  desc: {
    color: "#f0f0f0",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },
  buttonContainer: {
    width: "80%",
  },
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});