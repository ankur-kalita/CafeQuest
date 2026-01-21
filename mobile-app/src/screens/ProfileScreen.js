import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { cafesAPI } from '../api';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { getTagById } from '../constants/tags';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalCafes: 0,
    visitedCafes: 0,
    wishlistCafes: 0,
    topTags: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await cafesAPI.getAll();
      const cafes = response.data;

      const visited = cafes.filter((c) => c.status === 'visited');
      const wishlist = cafes.filter((c) => c.status === 'wishlist');

      // Calculate top tags
      const tagCount = {};
      cafes.forEach((cafe) => {
        cafe.tags?.forEach((tag) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      });

      const topTags = Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([tag, count]) => ({ tag, count }));

      setStats({
        totalCafes: cafes.length,
        visitedCafes: visited.length,
        wishlistCafes: wishlist.length,
        topTags,
      });
    } catch (error) {
      console.error('Error fetching stats:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user?.username)}</Text>
          </View>
        </View>
        <Text style={styles.username}>{user?.username || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.memberSince}>
          Member since {formatDate(user?.createdAt || new Date())}
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="cafe" size={28} color={COLORS.primary} />
          <Text style={styles.statNumber}>{stats.totalCafes}</Text>
          <Text style={styles.statLabel}>Total Cafes</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={28} color={COLORS.success} />
          <Text style={styles.statNumber}>{stats.visitedCafes}</Text>
          <Text style={styles.statLabel}>Visited</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="bookmark" size={28} color={COLORS.accent} />
          <Text style={styles.statNumber}>{stats.wishlistCafes}</Text>
          <Text style={styles.statLabel}>Wishlist</Text>
        </View>
      </View>

      {/* Top Tags */}
      {stats.topTags.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Top Features</Text>
          <View style={styles.tagsContainer}>
            {stats.topTags.map(({ tag, count }, index) => {
              const tagInfo = getTagById(tag);
              return tagInfo ? (
                <View key={tag} style={styles.tagItem}>
                  <View style={[styles.tagRank, { backgroundColor: index === 0 ? COLORS.star : COLORS.border }]}>
                    <Text style={[styles.tagRankText, { color: index === 0 ? COLORS.text : COLORS.textMuted }]}>
                      #{index + 1}
                    </Text>
                  </View>
                  <View style={styles.tagContent}>
                    <Ionicons name={tagInfo.icon} size={20} color={COLORS.primary} />
                    <Text style={styles.tagName}>{tagInfo.label}</Text>
                  </View>
                  <Text style={styles.tagCount}>{count} cafes</Text>
                </View>
              ) : null;
            })}
          </View>
        </View>
      )}

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="person-outline" size={22} color={COLORS.text} />
              <Text style={styles.menuText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="settings-outline" size={22} color={COLORS.text} />
              <Text style={styles.menuText}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="help-circle-outline" size={22} color={COLORS.text} />
              <Text style={styles.menuText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>CafeQuest</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
      </View>
    </ScrollView>
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
  header: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    borderBottomLeftRadius: SIZES.radiusXl,
    borderBottomRightRadius: SIZES.radiusXl,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.secondary,
  },
  avatarText: {
    fontSize: SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  username: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  email: {
    fontSize: SIZES.md,
    color: COLORS.white,
    opacity: 0.85,
  },
  memberSince: {
    fontSize: SIZES.sm,
    color: COLORS.white,
    opacity: 0.7,
    marginTop: 10,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: -24,
    marginHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    paddingVertical: 20,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  statNumber: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 10,
  },
  statLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 6,
    fontWeight: '500',
  },
  section: {
    marginTop: 28,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  tagsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    ...SHADOWS.small,
    overflow: 'hidden',
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tagRank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  tagRankText: {
    fontSize: SIZES.sm,
    fontWeight: '700',
  },
  tagContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagName: {
    fontSize: SIZES.md,
    color: COLORS.text,
    marginLeft: 12,
    fontWeight: '600',
  },
  tagCount: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    ...SHADOWS.small,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: SIZES.md,
    color: COLORS.text,
    marginLeft: 14,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 28,
    padding: 18,
    borderRadius: SIZES.radiusLg,
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  logoutText: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.error,
    marginLeft: 10,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  appName: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  appVersion: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 6,
  },
});

export default ProfileScreen;
