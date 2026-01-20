import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cafesAPI } from '../api';
import RatingInput from '../components/RatingInput';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { getTagById } from '../constants/tags';

const CafeDetailScreen = ({ navigation, route }) => {
  const { cafeId } = route.params;
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCafe();
  }, [cafeId]);

  const fetchCafe = async () => {
    try {
      const response = await cafesAPI.getOne(cafeId);
      setCafe(response.data);
    } catch (error) {
      Alert.alert('Error', error.message);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditCafe', { cafe });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Cafe',
      'Are you sure you want to delete this cafe? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await cafesAPI.delete(cafeId);
              Alert.alert('Deleted', 'Cafe has been removed from your collection.', [
                { text: 'OK', onPress: () => navigation.navigate('Home') },
              ]);
            } catch (error) {
              Alert.alert('Error', error.message);
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!cafe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Cafe not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          {cafe.photo ? (
            <Image source={{ uri: cafe.photo }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="cafe-outline" size={64} color={COLORS.textMuted} />
            </View>
          )}
          <View style={styles.imageOverlay}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {cafe.status === 'visited' ? 'Visited' : 'Wishlist'}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.name}>{cafe.name}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={18} color={COLORS.textLight} />
              <Text style={styles.location}>{cafe.location}</Text>
            </View>
          </View>

          {/* Rating */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rating</Text>
            <View style={styles.ratingContainer}>
              <RatingInput rating={cafe.rating} disabled size={28} />
              <Text style={styles.ratingText}>{cafe.rating}/5</Text>
            </View>
          </View>

          {/* Tags */}
          {cafe.tags && cafe.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.tagsContainer}>
                {cafe.tags.map((tagId) => {
                  const tag = getTagById(tagId);
                  return tag ? (
                    <View key={tagId} style={styles.tag}>
                      <Ionicons name={tag.icon} size={16} color={COLORS.primary} />
                      <Text style={styles.tagText}>{tag.label}</Text>
                    </View>
                  ) : null;
                })}
              </View>
            </View>
          )}

          {/* Notes */}
          {cafe.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <View style={styles.notesContainer}>
                <Text style={styles.notesText}>{cafe.notes}</Text>
              </View>
            </View>
          )}

          {/* Meta Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.metaContainer}>
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={18} color={COLORS.textMuted} />
                <Text style={styles.metaLabel}>
                  {cafe.status === 'visited' ? 'Visited on' : 'Added on'}
                </Text>
                <Text style={styles.metaValue}>
                  {formatDate(cafe.status === 'visited' ? cafe.visitedAt : cafe.createdAt)}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons
                  name={cafe.isPublic ? 'globe-outline' : 'lock-closed-outline'}
                  size={18}
                  color={COLORS.textMuted}
                />
                <Text style={styles.metaLabel}>Visibility</Text>
                <Text style={styles.metaValue}>
                  {cafe.isPublic ? 'Public' : 'Private'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={handleEdit}
        >
          <Ionicons name="create-outline" size={22} color={COLORS.primary} />
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator size="small" color={COLORS.error} />
          ) : (
            <>
              <Ionicons name="trash-outline" size={22} color={COLORS.error} />
              <Text style={styles.deleteBtnText}>Delete</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: SIZES.lg,
    color: COLORS.textMuted,
  },
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.border,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  statusBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: COLORS.white,
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
  content: {
    padding: SIZES.padding,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    marginLeft: 6,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    ...SHADOWS.small,
  },
  ratingText: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    ...SHADOWS.small,
  },
  tagText: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    marginLeft: 6,
    fontWeight: '500',
  },
  notesContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    ...SHADOWS.small,
  },
  notesText: {
    fontSize: SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  metaContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    ...SHADOWS.small,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  metaLabel: {
    fontSize: SIZES.md,
    color: COLORS.textMuted,
    marginLeft: 10,
    flex: 1,
  },
  metaValue: {
    fontSize: SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  actionBar: {
    flexDirection: 'row',
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    marginHorizontal: 6,
  },
  editBtn: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  editBtnText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
  deleteBtn: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  deleteBtnText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: 8,
  },
});

export default CafeDetailScreen;
