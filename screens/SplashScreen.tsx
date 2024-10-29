import React from 'react';
import { View } from 'react-native';
import { AnimatedSplashContent } from '../components/AnimatedSplashContent';
import { useSplashScreen } from '../hooks/useSplashScreen';

export default function SplashScreen() {
  const { onLayoutRootView, handleAnimationComplete } = useSplashScreen();
  return (
    <View onLayout={onLayoutRootView}>
      <AnimatedSplashContent onAnimationComplete={handleAnimationComplete} />
    </View>
  );
}
