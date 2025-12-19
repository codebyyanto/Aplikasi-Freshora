import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const IMAGE_MAP: Record<string, any> = {
  "peach.png": require("../../../assets/images/products/peach.png"),
  "avocado.png": require("../../../assets/images/products/avocado.png"),
  "pineapple.png": require("../../../assets/images/products/pineapple.png"),
  "grapes.png": require("../../../assets/images/products/grapes.png"),
  "pomegranate.png": require("../../../assets/images/products/pomegranate.png"),
  "broccoli.png": require("../../../assets/images/products/broccoli.png"),
  "default": require("../../../assets/images/products/peach.png")
};

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userFavorites");
      if (jsonValue != null) {
        setFavorites(JSON.parse(jsonValue));
      } else {
        setFavorites([]);
      }
    } catch (e) {
      console.error("Failed to load favorites", e);
    }
  };

  const removeFavorite = async (id: number) => {
    try {
      const newFavorites = favorites.filter(item => item.id !== id);
      setFavorites(newFavorites);
      await AsyncStorage.setItem("userFavorites", JSON.stringify(newFavorites));
    } catch (e) {
      console.error("Failed to remove favorite", e);
    }
  };

  const renderRightActions = (id: number) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeFavorite(id)}
      >
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </TouchableOpacity>
    );
  };