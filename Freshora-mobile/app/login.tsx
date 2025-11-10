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