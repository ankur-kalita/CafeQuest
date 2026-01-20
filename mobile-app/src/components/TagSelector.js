import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { CAFE_TAGS } from '../constants/tags';

const TagSelector = ({ selectedTags = [], onTagPress, horizontal = false }) => {
  const Container = horizontal ? ScrollView : View;
  const containerProps = horizontal
    ? { horizontal: true, showsHorizontalScrollIndicator: false }
    : {};

  return (
    <Container {...containerProps} style={horizontal ? styles.scrollContainer : styles.container}>
      {CAFE_TAGS.map((tag) => {
        const isSelected = selectedTags.includes(tag.id);
        return (
          <TouchableOpacity
            key={tag.id}
            style={[styles.tag, isSelected && styles.tagSelected]}
            onPress={() => onTagPress(tag.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tag.icon}
              size={16}
              color={isSelected ? COLORS.white : COLORS.primary}
            />
            <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
              {tag.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  tagSelected: {
    backgroundColor: COLORS.primary,
  },
  tagText: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    marginLeft: 6,
    fontWeight: '500',
  },
  tagTextSelected: {
    color: COLORS.white,
  },
});

export default TagSelector;
