const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add web-specific extension resolution
const webExts = ['web.js', 'web.jsx', 'web.ts', 'web.tsx'];
config.resolver.sourceExts = [...webExts, ...config.resolver.sourceExts.filter(ext => !webExts.includes(ext))];

// Web stubs for native modules that don't work on web
const webStubs = {
  'expo-secure-store': path.resolve(__dirname, 'expo-secure-store.web.js'),
  'expo-image-picker': path.resolve(__dirname, 'expo-image-picker.web.js'),
  'expo-font': path.resolve(__dirname, 'expo-font.web.js'),
};

// Store original resolveRequest if it exists
const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Replace native modules with web stubs on web platform
  if (platform === 'web' && webStubs[moduleName]) {
    return {
      filePath: webStubs[moduleName],
      type: 'sourceFile',
    };
  }
  
  // Use original resolver or default
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
