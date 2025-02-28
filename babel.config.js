module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Add any Babel plugins here if needed
      "expo-router/babel",
      "react-native-reanimated/plugin",
    ],
  };
};
