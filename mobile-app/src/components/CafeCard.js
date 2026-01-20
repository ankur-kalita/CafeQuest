import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { getTagById } from '../constants/tags';

const CafeCard = ({ cafe, onPress, showUser = false }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={14}
        color={COLORS.star}
      />
    ));
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {cafe.photo ? (
        <Image source={{ uri: cafe.photo }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Ionicons name="cafe-outline" size={40} color={COLORS.textMuted} />
        </View>
      )}
      <View style={styles.overlay}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {cafe.status === 'visited' ? 'Visited' : 'Wishlist'}
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {cafe.name}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color={COLORS.textMuted} />
          <Text style={styles.location} numberOfLines={1}>
            {cafe.location}
          </Text>
        </View>
        <View style={styles.ratingRow}>{renderStars(cafe.rating)}</View>
        {cafe.tags && cafe.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {cafe.tags.slice(0, 2).map((tagId) => {
              const tag = getTagById(tagId);
              return tag ? (
                <View key={tagId} style={styles.tag}>
                  <Ionicons name={tag.icon} size={10} color={COLORS.primary} />
                  <Text style={styles.tagText}>{tag.label}</Text>
                </View>
              ) : null;
            })}
            {cafe.tags.length > 2 && (
              <Text style={styles.moreText}>+{cafe.tags.length - 2}</Text>
            )}
          </View>
        )}
        {showUser && cafe.userId && (
          <View style={styles.userRow}>
            <Ionicons name="person-circle-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.userName}>
              {cafe.userId.username || 'Anonymous'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    ...SHADOWS.small,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.border,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  statusBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: COLORS.white,
    fontSize: SIZES.xs,
    fontWeight: '600',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  location: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginLeft: 4,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
  },
  tagText: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    marginLeft: 3,
  },
  moreText: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  userName: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
});

export default CafeCard;
