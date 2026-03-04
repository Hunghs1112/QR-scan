import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { styles } from "./styles";
import { IMAGES } from "./constants";

export const Features: React.FC = React.memo(() => {
  return (
    <View style={styles.featuresContainer}>
      <TouchableOpacity style={styles.featureButton}>
        <Image source={IMAGES.featureIcon1} style={styles.featureIconImage} />
        <Text style={styles.featureText}>Quét QR</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.featureButton}>
        <Image source={IMAGES.featureIcon2} style={styles.featureIconImage} />
        <Text style={styles.featureText}>Xác thực D-OTP</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.featureButton}>
        <Image source={IMAGES.featureIcon3} style={styles.featureIconImage} />
        <Text style={styles.featureText}>Tài khoản chạm</Text>
      </TouchableOpacity>
    </View>
  );
});