import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const ANIMATION_DURATION = 2000;
const FADE_DURATION = 2000;

// Move constants outside to prevent re-creation on each render
const COLORS = [
  '#FFA500',
  '#D3D3D3',
  '#000000',
  '#FFA500',
  '#008000',
  '#0000FF',
  '#FF0000',
  '#A52A2A',
];
const EMOJIS = ['🐅', '🐇', '🐧', '🐯', '🐲', '🐳', '🐦', '🐎'];

export const AnimatedSplashContent = ({ onAnimationComplete }: any) => {
  const houseOpacity = useRef(new Animated.Value(1)).current;
  const animals = Array.from(
    { length: 8 },
    () => useRef(new Animated.Value(0)).current,
  );

  useEffect(() => {
    const animateSequence = () => {
      // Fade out the house
      Animated.timing(houseOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();

      // Stagger the animal animations for a sequential appearance and disappearance
      Animated.stagger(
        ANIMATION_DURATION,
        animals.map((animal) =>
          Animated.sequence([
            Animated.timing(animal, {
              toValue: 1,
              duration: FADE_DURATION,
              useNativeDriver: true,
            }),
            Animated.timing(animal, {
              toValue: 0,
              duration: FADE_DURATION,
              useNativeDriver: true,
            }),
          ]),
        ),
      ).start(() => {
        onAnimationComplete && onAnimationComplete();
      });
    };

    animateSequence();
  }, [onAnimationComplete]);

  return (
    <View style={styles.container}>
      {/* House Animation */}
      <Animated.View style={[styles.fullScreen, { opacity: houseOpacity }]}>
        <View style={styles.house}>
          <View style={styles.roof} />
          <View style={styles.building}>
            <View style={styles.door} />
            <View style={[styles.window, { left: 45 }]} />
            <View style={[styles.window, { right: 45 }]} />
          </View>
        </View>
        <Text style={styles.text} accessibilityLabel="Household text">
          Household
        </Text>
      </Animated.View>

      {/* Animals Animation */}
      {animals.map((opacity, index) => (
        <Animated.View
          key={index}
          style={[
            styles.animatedAnimalView,
            { opacity, backgroundColor: COLORS[index] },
          ]}>
          <View style={styles.emojiContainer}>
            <Text
              style={styles.emoji}
              accessibilityLabel={`Animal emoji ${EMOJIS[index]}`}>
              {EMOJIS[index]}
            </Text>
            <Text style={styles.text}>Household</Text>
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
  },
  fullScreen: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedAnimalView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  house: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roof: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 150,
    borderRightWidth: 150,
    borderBottomWidth: 150,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
  building: {
    width: 300,
    height: 150,
    backgroundColor: 'white',
  },
  door: {
    width: 60,
    height: 120,
    backgroundColor: '#4A90E2',
    marginTop: 30,
    alignSelf: 'center',
  },
  window: {
    width: 50,
    height: 50,
    backgroundColor: '#4A90E2',
    position: 'absolute',
    top: 30,
  },
  emojiContainer: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 200,
  },
  text: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
