import React from 'react';
import Svg, { Path, Circle, Ellipse, G, Defs, LinearGradient, Stop } from 'react-native-svg';

const CoffeeIllustration = ({ size = 120 }) => {
  const scale = size / 120;

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Defs>
        <LinearGradient id="cupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#8B6F4E" />
          <Stop offset="100%" stopColor="#6F4E37" />
        </LinearGradient>
        <LinearGradient id="coffeeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#4A3728" />
          <Stop offset="100%" stopColor="#2D1F14" />
        </LinearGradient>
        <LinearGradient id="steamGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <Stop offset="0%" stopColor="#C4A77D" stopOpacity="0.8" />
          <Stop offset="100%" stopColor="#C4A77D" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Plate/Saucer */}
      <Ellipse cx="60" cy="105" rx="45" ry="8" fill="#E8E4DF" />
      <Ellipse cx="60" cy="103" rx="40" ry="6" fill="#D4CFC7" />

      {/* Cup body */}
      <Path
        d="M25 45 L30 95 C30 100 40 105 60 105 C80 105 90 100 90 95 L95 45 Z"
        fill="url(#cupGradient)"
      />

      {/* Cup rim */}
      <Ellipse cx="60" cy="45" rx="35" ry="8" fill="#A68B6A" />
      <Ellipse cx="60" cy="44" rx="32" ry="6" fill="url(#coffeeGradient)" />

      {/* Cup handle */}
      <Path
        d="M90 55 Q115 55 115 75 Q115 90 95 85"
        stroke="#8B6F4E"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M90 55 Q110 55 110 72 Q110 85 95 82"
        stroke="#A68B6A"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Steam lines */}
      <G opacity="0.6">
        <Path
          d="M45 35 Q42 25 48 15 Q52 5 45 -5"
          stroke="url(#steamGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M60 32 Q57 20 63 10 Q67 0 60 -10"
          stroke="url(#steamGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M75 35 Q72 25 78 15 Q82 5 75 -5"
          stroke="url(#steamGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </G>

      {/* Coffee beans decoration */}
      <G transform="translate(15, 90)">
        <Ellipse cx="5" cy="5" rx="6" ry="4" fill="#4A3728" transform="rotate(-30 5 5)" />
        <Path d="M2 5 Q5 3 8 5" stroke="#2D1F14" strokeWidth="1" fill="none" />
      </G>
      <G transform="translate(95, 95)">
        <Ellipse cx="5" cy="5" rx="5" ry="3.5" fill="#4A3728" transform="rotate(20 5 5)" />
        <Path d="M2.5 5 Q5 3.5 7.5 5" stroke="#2D1F14" strokeWidth="1" fill="none" />
      </G>

      {/* Highlight on cup */}
      <Path
        d="M35 55 Q33 70 36 85"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default CoffeeIllustration;
