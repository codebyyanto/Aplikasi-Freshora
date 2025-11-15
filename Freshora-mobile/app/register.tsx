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

  };