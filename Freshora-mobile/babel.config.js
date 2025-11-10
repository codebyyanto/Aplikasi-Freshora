module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // untuk navigasi Expo Router
      "expo-router/babel",

      // agar animasi react-native-reanimated berfungsi
      "react-native-reanimated/plugin",
    ],
  };
};
