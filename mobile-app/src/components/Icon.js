import React from 'react';
import { Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Map Ionicons names to emoji/text for web
const iconMap = {
  // Navigation
  'home': '🏠',
  'home-outline': '🏠',
  'add-circle': '➕',
  'add-circle-outline': '➕',
  'compass': '🧭',
  'compass-outline': '🧭',
  'person': '👤',
  'person-outline': '👤',

  // Cafe related
  'cafe': '☕',
  'cafe-outline': '☕',
  'location': '📍',
  'location-outline': '📍',
  'star': '⭐',
  'star-outline': '☆',
  'bookmark': '🔖',
  'bookmark-outline': '🔖',

  // Tags
  'wifi': '📶',
  'wifi-outline': '📶',
  'volume-mute': '🔇',
  'volume-mute-outline': '🔇',
  'camera': '📷',
  'camera-outline': '📷',
  'paw': '🐾',
  'paw-outline': '🐾',
  'thumbs-up': '👍',
  'thumbs-up-outline': '👍',

  // Actions
  'search': '🔍',
  'search-outline': '🔍',
  'close-circle': '✖',
  'close-circle-outline': '✖',
  'create': '✏️',
  'create-outline': '✏️',
  'trash': '🗑️',
  'trash-outline': '🗑️',
  'checkmark-circle': '✅',
  'checkmark-circle-outline': '✅',
  'checkmark': '✓',

  // Auth
  'mail': '✉️',
  'mail-outline': '✉️',
  'lock-closed': '🔒',
  'lock-closed-outline': '🔒',
  'eye': '👁️',
  'eye-outline': '👁️',
  'eye-off': '🙈',
  'eye-off-outline': '🙈',
  'log-out': '🚪',
  'log-out-outline': '🚪',

  // Profile
  'settings': '⚙️',
  'settings-outline': '⚙️',
  'help-circle': '❓',
  'help-circle-outline': '❓',
  'information-circle': 'ℹ️',
  'information-circle-outline': 'ℹ️',
  'chevron-forward': '›',
  'chevron-back': '‹',

  // Details
  'calendar': '📅',
  'calendar-outline': '📅',
  'globe': '🌐',
  'globe-outline': '🌐',
  'time': '🕐',
  'time-outline': '🕐',
};

const Icon = ({ name, size = 24, color, style }) => {
  if (Platform.OS === 'web') {
    const emoji = iconMap[name] || '•';
    return (
      <Text style={[{ fontSize: size * 0.8, color, textAlign: 'center' }, style]}>
        {emoji}
      </Text>
    );
  }

  return <Ionicons name={name} size={size} color={color} style={style} />;
};

export default Icon;
