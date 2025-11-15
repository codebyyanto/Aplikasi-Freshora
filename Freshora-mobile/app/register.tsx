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