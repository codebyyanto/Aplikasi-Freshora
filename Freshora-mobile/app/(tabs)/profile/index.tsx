import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, ENDPOINTS } from "../../../constants/Config";
import React, { useEffect, useState } from "react";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "User",
    email: "user@example.com",
    avatar: "avatar.png",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const res = await fetch(`${API_BASE_URL}${ENDPOINTS.ME}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok && data.user) {
          setUser({
            name: data.user.name,
            email: data.user.email,
            avatar: "https://img.freepik.com/premium-vector/vector-flat-icon-isolated-user-profile-avatar-silhouette-man-woman-gray-silhouette-black-background-perfect-social-media-messengers-stories-your-adx9xa_719432-807.jpg"
          });
        }
      }
    } catch (e) {
      console.error("Profile fetch error", e);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userInfo");
    router.replace("/login");
  };

  const menu = [
    { icon: "person-outline", text: "Tentang Saya", action: () => { } },
    { icon: "cube-outline", text: "My Orders", action: () => router.push("/orders") },
    { icon: "heart-outline", text: "My Favorites", action: () => router.push("/(tabs)/favorites") },
    { icon: "location-outline", text: "My Address", action: () => { } },
    { icon: "log-out-outline", text: "Sign out", action: handleLogout },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileBox}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <TouchableOpacity style={styles.cameraBtn}>
          <Ionicons name="camera" size={16} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.menuBox}>
        {menu.map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem} onPress={item.action}>
            <Ionicons name={item.icon as any} size={22} color="#6CC51D" />
            <Text style={styles.menuText}>{item.text}</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  profileBox: { alignItems: "center", paddingVertical: 30 },
  avatar: { width: 90, height: 90, borderRadius: 45 },

  cameraBtn: {
    position: "absolute",
    bottom: 35,
    right: 150,
    backgroundColor: "#6CC51D",
    padding: 5,
    borderRadius: 12,
  },

  name: { fontSize: 18, fontWeight: "700", color: "#333", marginTop: 10 },
  email: { color: "#777", fontSize: 13 },

  menuBox: { marginTop: 10 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F3F3",
  },

  menuText: {
    flex: 1,
    marginLeft: 15,
    color: "#333",
    fontSize: 15,
  },
});