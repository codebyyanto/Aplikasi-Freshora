import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");

export default function RegisterScreen() {
  // State untuk menyimpan data input user
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  // Animasi posisi modal (akan naik saat keyboard muncul)
  const modalY = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Listener saat keyboard muncul
    const show = Keyboard.addListener("keyboardDidShow", () => {
      Animated.timing(modalY, {
        toValue: -height * 0.30, 
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    // Listener saat keyboard disembunyikan
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(modalY, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    // Hapus listener agar tidak terjadi memory leak
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Fungsi untuk mengirim data pendaftaran ke backend API
  const handleSignup = async () => {
    try {
      // Lakukan permintaan POST ke endpoint register API
      const res = await fetch("http://192.168.100.10:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      // Ambil hasil respons dari server
      const data = await res.json();

      // Jika server memberikan status selain 200 OK → lempar error
      if (!res.ok) throw new Error(data.message);

      // Berhasil daftar
      Alert.alert("Pendaftaran Berhasil", "Silakan login untuk melanjutkan");

      // Arahkan user ke halaman login
      router.push("/login");
    } catch (err: any) {
      // Tangani error (misalnya email sudah terdaftar)
      Alert.alert("Gagal Daftar", err.message);
    }
  };
// Render tampilan register
return (
    <ImageBackground
      source={require("../assets/bg-register.png")} // ✅ Gambar latar belakang halaman register
      style={styles.bg}
      resizeMode="cover"
    >
      {/* Lapisan transparan hitam agar teks lebih kontras */}
      <View style={styles.overlay} />

      {/* Animated.View agar modal dapat bergerak naik/turun saat keyboard aktif */}
      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ translateY: modalY }], 
          },
        ]}
      >
        {/* Judul halaman */}
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Quickly create account</Text>

        {/*  Input nama lengkap */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Full name"
            placeholderTextColor="#777"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Input email */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Email address"
            placeholderTextColor="#777"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Input nomor telepon */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Phone number"
            placeholderTextColor="#777"
            style={styles.input}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Input password */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#777"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

         {/*  Tombol Signup dengan efek gradasi hijau */}
        <TouchableOpacity style={styles.btnContainer} onPress={handleSignup}>
          <LinearGradient colors={["#7ED957", "#6CC51D"]} style={styles.btn}>
            <Text style={styles.btnText}>Signup</Text>
          </LinearGradient>
        </TouchableOpacity>

//   styles tampilan register
  const styles = StyleSheet.create({
  bg: { flex: 1, justifyContent: "flex-end" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)", 
  },
  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  title: { fontSize: 22, fontWeight: "700", color: "#000" },
  subtitle: { color: "#777", marginBottom: 25 },
  inputBox: {
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  input: {
    height: 48,
    fontSize: 14,
    color: "#000",
  },
  btnContainer: { width: "100%", marginTop: 10 },
  btn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  footer: {
    textAlign: "center",
    marginTop: 15,
    color: "#777",
  },
  link: { color: "#6CC51D", fontWeight: "600" },
});