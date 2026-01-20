import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="cafe" size={80} color={COLORS.white} />
        <Text style={styles.title}>CafeQuest</Text>
        <Text style={styles.subtitle}>Your personal coffee shop companion</Text>
      </View>
      <ActivityIndicator size="large" color={COLORS.white} style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: 16,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: 8,
  },
  loader: {
    position: 'absolute',
    bottom: 100,
  },
});

export default SplashScreen;
