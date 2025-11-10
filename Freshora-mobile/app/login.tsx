// Import library dan komponen yang dibutuhkan
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
  Platform,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

// Ambil ukuran layar perangkat
const { height } = Dimensions.get("window");

// Komponen utama halaman login
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const modalY = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
      const offset = Platform.OS === "ios" ? -height * 0.47 : -height * 0.35;
      Animated.timing(modalY, {
        toValue: offset,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
      Animated.timing(modalY, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, [modalY]);

  // Fungsi login terhubung dengan Freshora-API
  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Peringatan", "Email dan password wajib diisi.");
    }

    try {
      const response = await fetch("http://192.168.100.10:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal, periksa kembali data Anda.");
      }

      if (data.token) {
      }

      Alert.alert("Login Berhasil", `Selamat datang, ${data.user?.name || "User"}!`);

      // ke halaman home
      router.push("/home");
    } catch (error: any) {
      Alert.alert("Gagal Login", error.message);
    }
  };

  // Tampilan halaman login
  return (
    <ImageBackground
      source={require("../assets/bg-login.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ translateY: modalY }],
          },
        ]}
      >
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <View style={styles.inputBox}>
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#777"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

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

        {!keyboardVisible && (
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.btnContainer} onPress={handleLogin}>
          <LinearGradient colors={["#7ED957", "#6CC51D"]} style={styles.btn}>
            <Text style={styles.btnText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        {!keyboardVisible && (
          <Text style={styles.footer}>
            Don’t have an account?{" "}
            <Text style={styles.link} onPress={() => router.push("/register")}>
              Sign up
            </Text>
          </Text>
        )}
      </Animated.View>
    </ImageBackground>
  );
}

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
  forgot: {
    color: "#6CC51D",
    textAlign: "right",
    marginBottom: 25,
  },
  btnContainer: { width: "100%" },
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