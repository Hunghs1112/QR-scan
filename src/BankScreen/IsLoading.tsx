import React, { useRef, useEffect } from "react";
import { View, Image, StyleSheet, Animated, Easing } from "react-native";

interface IsLoadingProps {
  visible: boolean;
}

const IsLoading: React.FC<IsLoadingProps> = ({ visible = false }) => {
  // Use useRef to persist the Animated value across renders
  const spinValue = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Set up the animation
  useEffect(() => {
    if (visible) {
      // Stop any existing animation
      if (animationRef.current) {
        animationRef.current.stop();
      }
      // Reset to 0 before starting
      spinValue.setValue(0);
      // Start the loop animation
      animationRef.current = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000, // Duration for one full rotation (in milliseconds)
          easing: Easing.linear, // Linear easing for smooth rotation
          useNativeDriver: true, // Use native driver for better performance
        })
      );
      animationRef.current.start();
    } else {
      // Stop animation when not visible
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      // Reset value
      spinValue.setValue(0);
    }
    
    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, [visible, spinValue]);

  // Map spinValue to rotation degrees (0 to 360 degrees)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.loader}>
        <Animated.Image
          source={require("../screen/image/isloading.png")} // Adjust the path to your image file
          style={[styles.image, { transform: [{ rotate: spin }] }]} // Apply rotation
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loader: {
    width: 70, // Fixed width for the loader
    height: 70, // Fixed height for the loader
    backgroundColor: "black",
    borderRadius: 10,
    elevation: 1,
    justifyContent: "center", // Center the image inside the loader
    alignItems: "center", // Center the image inside the loader
  },
  image: {
    width: 50, // Image size
    height: 50, // Image size
  },
});

export default IsLoading;