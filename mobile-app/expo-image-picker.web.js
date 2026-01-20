// Web stub for expo-image-picker
// Uses file input on web as a fallback

export const MediaTypeOptions = {
  All: 'all',
  Images: 'images',
  Videos: 'videos',
};

export const CameraType = {
  front: 'front',
  back: 'back',
};

export async function requestCameraPermissionsAsync() {
  return { status: 'granted' };
}

export async function requestMediaLibraryPermissionsAsync() {
  return { status: 'granted' };
}

export async function launchCameraAsync(options = {}) {
  console.warn('Camera not available on web, use launchImageLibraryAsync instead');
  return { canceled: true, assets: null };
}

export async function launchImageLibraryAsync(options = {}) {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            canceled: false,
            assets: [{
              uri: event.target.result,
              width: 0,
              height: 0,
              type: 'image',
            }],
          });
        };
        reader.readAsDataURL(file);
      } else {
        resolve({ canceled: true, assets: null });
      }
    };
    
    input.click();
  });
}

export default {
  MediaTypeOptions,
  CameraType,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
  launchCameraAsync,
  launchImageLibraryAsync,
};
