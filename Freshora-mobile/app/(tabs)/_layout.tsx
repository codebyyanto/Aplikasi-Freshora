import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6CC51D",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "#fff",
          position: "absolute",
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}