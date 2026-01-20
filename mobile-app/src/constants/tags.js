export const CAFE_TAGS = [
  { id: 'wifi', label: 'WiFi', icon: 'wifi' },
  { id: 'quiet', label: 'Quiet', icon: 'volume-off' },
  { id: 'aesthetic', label: 'Aesthetic', icon: 'camera' },
  { id: 'good-coffee', label: 'Good Coffee', icon: 'cafe' },
  { id: 'pet-friendly', label: 'Pet Friendly', icon: 'paw' },
];

export const CAFE_STATUS = [
  { id: 'visited', label: 'Visited' },
  { id: 'wishlist', label: 'Wishlist' },
];

export const getTagById = (id) => CAFE_TAGS.find((tag) => tag.id === id);
export const getTagLabel = (id) => getTagById(id)?.label || id;
