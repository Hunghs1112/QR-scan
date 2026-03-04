import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View, Image, Dimensions } from "react-native";
import { styles } from "./styles";
import { IMAGES } from "./constants";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SLIDE_WIDTH = SCREEN_WIDTH * 0.7;
const MARGIN_RIGHT = 15;
const SLIDE_INTERVAL = 4000;
const PADDING_HORIZONTAL = (SCREEN_WIDTH - SLIDE_WIDTH) / 2;

const slides = [IMAGES.banner1, IMAGES.banner2, IMAGES.banner3, IMAGES.banner4, IMAGES.banner5,IMAGES.banner6, IMAGES.banner7 ];

export const BannerSection: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCount = slides.length;

  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % slideCount;
      setCurrentSlide(nextSlide);
      const scrollX = nextSlide * (SLIDE_WIDTH + MARGIN_RIGHT);
      scrollViewRef.current?.scrollTo({
        x: scrollX,
        animated: true,
      });
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const contentContainerStyle = {
    paddingLeft: PADDING_HORIZONTAL,
    paddingRight: PADDING_HORIZONTAL,
  };

  return (
    <View style={styles.bannerSectionContainer}>
      <View style={styles.bannerSection}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bannerSlider}
          snapToAlignment="center"
          snapToInterval={SLIDE_WIDTH + MARGIN_RIGHT}
          decelerationRate="fast"
          contentContainerStyle={[styles.bannerContentContainer, contentContainerStyle]}
          contentOffset={{ x: 0, y: 0 }}
        >
          {slides.map((image, index) => (
            <View key={index} style={styles.bannerItem}>
              <Image source={image} style={styles.bannerImage} />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};