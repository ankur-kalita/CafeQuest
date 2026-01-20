// Web stub for expo-font
// Provides basic font loading using CSS

const loaded = new Map();

export async function loadAsync(fontSource) {
  if (typeof fontSource === 'object') {
    const fontNames = Object.keys(fontSource);
    await Promise.all(
      fontNames.map(async (fontFamily) => {
        const source = fontSource[fontFamily];
        if (loaded.has(fontFamily)) {
          return;
        }
        
        const fontUrl = typeof source === 'string' ? source : source.uri || source.default;
        if (!fontUrl) {
          console.warn(`Invalid font source for ${fontFamily}`);
          return;
        }
        
        const fontFace = new FontFace(fontFamily, `url(${fontUrl})`);
        try {
          await fontFace.load();
          document.fonts.add(fontFace);
          loaded.set(fontFamily, true);
        } catch (e) {
          console.warn(`Failed to load font ${fontFamily}:`, e);
        }
      })
    );
  }
}

export function isLoaded(fontFamily) {
  return loaded.has(fontFamily);
}

export function isLoading(fontFamily) {
  return false;
}

export async function unloadAsync(fontFamily) {
  loaded.delete(fontFamily);
}

export function useFonts(fonts) {
  const [fontsLoaded, setFontsLoaded] = require('react').useState(false);
  
  require('react').useEffect(() => {
    loadAsync(fonts).then(() => setFontsLoaded(true));
  }, []);
  
  return [fontsLoaded];
}

export default {
  loadAsync,
  isLoaded,
  isLoading,
  unloadAsync,
  useFonts,
};
