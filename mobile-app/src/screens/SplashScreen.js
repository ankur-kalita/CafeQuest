import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS, SIZES } from '../constants/theme';

// White coffee cup SVG for splash screen
const WhiteCoffeeCup = ({ size = 80 }) => (
  <Svg width={size} height={size} viewBox="0 0 80 80">
    <Defs>
      <LinearGradient id="splashSteam" x1="0%" y1="100%" x2="0%" y2="0%">
        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </LinearGradient>
    </Defs>
    {/* Cup body */}
    <Path
      d="M15 30 L18 65 C18 70 28 75 40 75 C52 75 62 70 62 65 L65 30 Z"
      fill="#FFFFFF"
    />
    {/* Cup rim */}
    <Ellipse cx="40" cy="30" rx="25" ry="6" fill="rgba(255,255,255,0.8)" />
    {/* Coffee surface */}
    <Ellipse cx="40" cy="29" rx="22" ry="4" fill="rgba(74,55,40,0.6)" />
    {/* Handle */}
    <Path
      d="M62 38 Q78 38 78 52 Q78 64 65 60"
      stroke="#FFFFFF"
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
    />
    {/* Steam */}
    <G opacity="0.5">
      <Path d="M30 22 Q28 14 32 6" stroke="url(#splashSteam)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M40 20 Q38 10 42 2" stroke="url(#splashSteam)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M50 22 Q48 14 52 6" stroke="url(#splashSteam)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </G>
  </Svg>
);

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <WhiteCoffeeCup size={90} />
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
    fontSize: 42,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: 20,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.white,
    opacity: 0.85,
    marginTop: 12,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  loader: {
    position: 'absolute',
    bottom: 120,
  },
});

export default SplashScreen;
