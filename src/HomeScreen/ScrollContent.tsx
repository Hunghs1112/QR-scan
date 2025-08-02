import React, { useEffect, useRef } from "react";
import { ScrollView, Animated, RefreshControl, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { styles } from "./styles";
import { BalanceSection } from "./BalanceSection";
import { QuickActionsSection } from "./QuickActionsSection";
import { GridSection } from "./GridSection";
import { BannerSection } from "./BannerSection";
import { TouchableOpacity } from "react-native";

interface ScrollContentProps {
  refreshing: boolean;
  handleRefresh: () => void;
  handleScroll: (event: any) => void;
  balance: number | undefined;
  isBalanceVisible: boolean;
  handleEyeClick: () => void;
  formatVND: (value: number) => string;
  showLoadingArea: boolean;
  loadingOpacity: Animated.Value;
}

export const ScrollContent: React.FC<ScrollContentProps> = ({
  refreshing,
  handleRefresh,
  handleScroll,
  balance,
  isBalanceVisible,
  handleEyeClick,
  formatVND,
  showLoadingArea,
  loadingOpacity,
}) => {
  const translateY = useRef(new Animated.Value(-5)).current;

  useEffect(() => {
    let value = -4;
    let direction = 1;
    const speed = 0.14;
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
    <>
      {showLoadingArea && (
        <Animated.View style={[styles.loadingArea, { opacity: loadingOpacity }]}>
          <View style={styles.loadingCircle}>
            <Ionicons name="refresh" size={22} color="#FFF" />
          </View>
        </Animated.View>
      )}
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BalanceSection
          balance={balance}
          isBalanceVisible={isBalanceVisible}
          handleEyeClick={handleEyeClick}
          formatVND={formatVND}
        />
        <View style={styles.whiteContainer}>
          <QuickActionsSection />
          <TouchableOpacity style={styles.separatorButton}>
            <Animated.View style={{ transform: [{ translateY }] }}>
              <FontAwesome5 name="angle-double-down" size={13} color="#FFF" />
            </Animated.View>
          </TouchableOpacity>
          <BannerSection />
          <GridSection />
        </View>
      </ScrollView>
    </>
  );
};