import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function FavoritesHeaderOnly() {
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Favorites</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* AREA KONTEN KOSONG */}
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Tempat Menampilkan Konten Favorit (template only)</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    elevation: 2,
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 20,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 14,
    color: "#999",
  },
});
