import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { styles } from "./styles";

export const Footer: React.FC = () => {
  const translateY = useRef(new Animated.Value(-5)).current;

  useEffect(() => {
    let value = -5;
    let direction = 1;
    const speed = 0.25;
    let rafId: number;

    const animate = () => {
      value += direction * speed;
      if (value >= 5) direction = -1;
      if (value <= -5) direction = 1;
      translateY.setValue(value);
      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      translateY.stopAnimation();
    };
  }, [translateY]);

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerArrow}>
        <Animated.View style={{ transform: [{ translateY }] }}>
          <Icon name="angle-double-up" size={24} color="rgba(255, 255, 255, 0.7)" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};