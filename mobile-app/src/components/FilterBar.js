import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from './Icon';
import { COLORS, SIZES } from '../constants/theme';
import { CAFE_STATUS, CAFE_TAGS } from '../constants/tags';

const FilterBar = ({
  selectedStatus,
  onStatusChange,
  selectedTags = [],
  onTagChange,
  showTags = true
}) => {
  return (
    <View style={styles.container}>
      {/* Status Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statusRow}
      >
        <TouchableOpacity
          style={[styles.statusChip, !selectedStatus && styles.statusChipActive]}
          onPress={() => onStatusChange(null)}
        >
          <Text style={[styles.statusText, !selectedStatus && styles.statusTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {CAFE_STATUS.map((status) => (
          <TouchableOpacity
            key={status.id}
            style={[
              styles.statusChip,
              selectedStatus === status.id && styles.statusChipActive,
            ]}
            onPress={() => onStatusChange(status.id)}
          >
            <Text
              style={[
                styles.statusText,
                selectedStatus === status.id && styles.statusTextActive,
              ]}
            >
              {status.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tags Filter */}
      {showTags && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsRow}
        >
          {CAFE_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <TouchableOpacity
                key={tag.id}
                style={[styles.tagChip, isSelected && styles.tagChipActive]}
                onPress={() => onTagChange(tag.id)}
              >
                <Icon
                  name={tag.icon}
                  size={14}
                  color={isSelected ? COLORS.white : COLORS.primary}
                />
                <Text style={[styles.tagText, isSelected && styles.tagTextActive]}>
                  {tag.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statusRow: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  statusChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  statusChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  statusTextActive: {
    color: COLORS.white,
  },
  tagsRow: {
    paddingHorizontal: 16,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: COLORS.accentLight,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
  },
  tagChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tagText: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    marginLeft: 6,
    fontWeight: '600',
  },
  tagTextActive: {
    color: COLORS.white,
  },
});

export default FilterBar;
