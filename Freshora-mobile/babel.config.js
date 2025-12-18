module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // agar animasi react-native-reanimated berfungsi
      "react-native-reanimated/plugin",
    ],
  };
};
