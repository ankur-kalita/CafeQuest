import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from './Icon';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { getTagById } from '../constants/tags';

const CafeCard = ({ cafe, onPress, showUser = false }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Icon
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
          <Icon name="cafe-outline" size={40} color={COLORS.textMuted} />
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
          <Icon name="location-outline" size={12} color={COLORS.textMuted} />
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
                  <Icon name={tag.icon} size={10} color={COLORS.primary} />
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
            <Icon name="person-circle-outline" size={14} color={COLORS.textMuted} />
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
    ...SHADOWS.medium,
    marginBottom: 14,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: COLORS.accentLight,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
  },
  overlay: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  statusBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  statusText: {
    color: COLORS.white,
    fontSize: SIZES.xs,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  content: {
    padding: 14,
  },
  name: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginLeft: 5,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tagText: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  moreText: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  userName: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginLeft: 6,
    fontWeight: '500',
  },
});

export default CafeCard;
