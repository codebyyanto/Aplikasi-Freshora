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

  const renderItem = ({ item }: { item: any }) => {
    const imageSource = item.image && IMAGE_MAP[item.image] ? IMAGE_MAP[item.image] : IMAGE_MAP["default"];

    return (
      <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={imageSource} style={styles.image} resizeMode="contain" />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.priceText}>Rp {item.price.toLocaleString("id-ID")}</Text>
            <Text style={styles.nameText}>{item.name}</Text>
            <Text style={styles.weightText}>1 kg</Text>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => Alert.alert("Feature", "Add to cart logic here")}>
              <Ionicons name="add" size={20} color="#6CC51D" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={() => removeFavorite(item.id)}>
              <Ionicons name="remove" size={20} color="#6CC51D" />
            </TouchableOpacity>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Favorites</Text>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="heart-dislike-outline" size={60} color="#DDD" />
              <Text style={styles.emptyText}>Belum ada barang favorit</Text>
            </View>
          }
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333"
  },
  listContent: {
    padding: 20,
    paddingBottom: 100
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F7FA"
  },
  imageContainer: {
    width: 70,
    height: 70,
    backgroundColor: "#F8F8F8",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15
  },
  image: {
    width: 45,
    height: 45
  },
  infoContainer: {
    flex: 1
  },
  priceText: {
    color: "#6CC51D",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2
  },
  weightText: {
    color: "#999",
    fontSize: 12
  },
  actionsContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    height: 60
  },
  iconBtn: {
    padding: 5
  },
  deleteButton: {
    backgroundColor: "#FF5252",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
    marginBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100
  },
  emptyText: {
    color: "#999",
    marginTop: 10
  }
});