import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Stack, Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, ENDPOINTS } from "../../../../constants/Config";