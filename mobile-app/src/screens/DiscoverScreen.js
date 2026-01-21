import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { discoverAPI } from '../api';
import CafeCard from '../components/CafeCard';
import { COLORS, SIZES } from '../constants/theme';
import { CAFE_TAGS } from '../constants/tags';

const DiscoverScreen = ({ navigation }) => {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchCafes = async (pageNum = 1, append = false) => {
    try {
      const params = { page: pageNum, limit: 10 };
      if (selectedTags.length > 0) params.tags = selectedTags.join(',');
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const response = await discoverAPI.getPublicCafes(params);
      const { cafes: newCafes, pages } = response.data;

      if (append) {
        setCafes((prev) => [...prev, ...newCafes]);
      } else {
        setCafes(newCafes);
      }

      setHasMore(pageNum < pages);
    } catch (error) {
      console.error('Error fetching discover cafes:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      fetchCafes(1, false);
    }, [selectedTags, searchQuery])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchCafes(1, false);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCafes(nextPage, true);
    }
  };

  const handleTagChange = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSaveCafe = async (cafeId) => {
    try {
      await discoverAPI.saveCafe(cafeId);
      Alert.alert('Saved!', 'Cafe added to your wishlist');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderCafe = ({ item }) => (
    <View style={styles.cardWrapper}>
      <CafeCard cafe={item} showUser={true} onPress={() => {}} />
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => handleSaveCafe(item._id)}
      >
        <Ionicons name="bookmark-outline" size={18} color={COLORS.primary} />
        <Text style={styles.saveBtnText}>Save to Wishlist</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="compass-outline" size={64} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No cafes to discover</Text>
      <Text style={styles.emptyText}>
        {searchQuery || selectedTags.length > 0
          ? 'Try adjusting your filters'
          : 'Check back later for new recommendations'}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  const renderHeader = () => (
    <>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cafes..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Ionicons
              name="close-circle"
              size={20}
              color={COLORS.textMuted}
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>
      </View>

      {/* Tags Filter */}
      <View style={styles.tagsContainer}>
        <FlatList
          data={CAFE_TAGS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.tagsList}
          renderItem={({ item }) => {
            const isSelected = selectedTags.includes(item.id);
            return (
              <TouchableOpacity
                style={[styles.tagChip, isSelected && styles.tagChipActive]}
                onPress={() => handleTagChange(item.id)}
              >
                <Ionicons
                  name={item.icon}
                  size={14}
                  color={isSelected ? COLORS.white : COLORS.primary}
                />
                <Text style={[styles.tagText, isSelected && styles.tagTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle-outline" size={20} color={COLORS.textMuted} />
        <Text style={styles.infoText}>
          Discover cafes shared by other coffee lovers
        </Text>
      </View>
    </>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cafes}
        renderItem={renderCafe}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
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
  searchContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusLg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  tagsContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tagsList: {
    paddingHorizontal: 16,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
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
    marginLeft: 8,
    fontWeight: '600',
  },
  tagTextActive: {
    color: COLORS.white,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  infoText: {
    flex: 1,
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginLeft: 10,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 24,
  },
  cardWrapper: {
    marginHorizontal: 16,
    marginTop: 14,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accentLight,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    marginTop: -10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: COLORS.secondary,
  },
  saveBtnText: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 20,
  },
  emptyText: {
    fontSize: SIZES.md,
    color: COLORS.textMuted,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 22,
  },
  footerLoader: {
    paddingVertical: 24,
    alignItems: 'center',
  },
});

export default DiscoverScreen;
