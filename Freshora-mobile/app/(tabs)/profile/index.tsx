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
            avatar: "https://i.pravatar.cc/150"
          });
        }
      }
    } catch (e) {
      console.error("Profile fetch error", e);
    }
  };