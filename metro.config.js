const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add .wasm to asset extensions
config.resolver.assetExts.push("wasm");

// Add .mjs to source extensions
config.resolver.sourceExts.push("mjs", "cjs");
config.resolver.unstable_enablePackageExports = true;

module.exports = withNativeWind(config, {
  input: "./app/global.css",
  inlineRem: 16,
});
