import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from '../components/Icon';
import { cafesAPI } from '../api';
import CafeCard from '../components/CafeCard';
import FilterBar from '../components/FilterBar';
import { COLORS, SIZES } from '../constants/theme';

const HomeScreen = ({ navigation }) => {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const fetchCafes = async () => {
    try {
      const params = {};
      if (selectedStatus) params.status = selectedStatus;
      if (selectedTags.length > 0) params.tags = selectedTags.join(',');
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const response = await cafesAPI.getAll(params);
      setCafes(response.data);
    } catch (error) {
      console.error('Error fetching cafes:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCafes();
    }, [selectedStatus, selectedTags, searchQuery])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchCafes();
  };

  const handleTagChange = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const renderCafe = ({ item, index }) => (
    <View style={[styles.cardWrapper, index % 2 === 0 ? styles.cardLeft : styles.cardRight]}>
      <CafeCard
        cafe={item}
        onPress={() => navigation.navigate('CafeDetail', { cafeId: item._id })}
      />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="cafe-outline" size={64} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No cafes yet</Text>
      <Text style={styles.emptyText}>
        {searchQuery || selectedStatus || selectedTags.length > 0
          ? 'Try adjusting your filters'
          : 'Start adding your favorite cafes!'}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cafes..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Icon
              name="close-circle"
              size={20}
              color={COLORS.textMuted}
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>
      </View>

      {/* Filters */}
      <FilterBar
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedTags={selectedTags}
        onTagChange={handleTagChange}
      />

      {/* Results Count */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {cafes.length} {cafes.length === 1 ? 'cafe' : 'cafes'}
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
        numColumns={2}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
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
  resultsRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsText: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '50%',
  },
  cardLeft: {
    paddingRight: 7,
  },
  cardRight: {
    paddingLeft: 7,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
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
    lineHeight: 22,
  },
});

export default HomeScreen;
