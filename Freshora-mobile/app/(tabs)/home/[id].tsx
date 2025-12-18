// Import React dan hooks yang dibutuhkan
import React, { useEffect, useState } from "react";

// Import komponen UI dari React Native
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";

// Import ikon dari Expo
import { Ionicons } from "@expo/vector-icons";

// Import routing dan parameter URL dari Expo Router
import { useLocalSearchParams, useRouter } from "expo-router";
