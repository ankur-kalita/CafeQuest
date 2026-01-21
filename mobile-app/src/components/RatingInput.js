import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const RatingInput = ({ rating = 0, onRatingChange, size = 32, disabled = false }) => {
  const handlePress = (value) => {
    if (!disabled && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((value) => (
        <TouchableOpacity
          key={value}
          onPress={() => handlePress(value)}
          disabled={disabled}
          style={styles.star}
        >
          <Ionicons
            name={value <= rating ? 'star' : 'star-outline'}
            size={size}
            color={COLORS.star}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  star: {
    padding: 4,
  },
});

export default RatingInput;
