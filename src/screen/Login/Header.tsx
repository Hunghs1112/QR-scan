import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { styles } from "./styles";
import { IMAGES } from "./constants";

export const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.logoStar}>
          <Image source={IMAGES.logo} style={styles.logoImage} />
        </View>
      </View>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconButton}>
          <Image source={IMAGES.icon1} style={styles.iconImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Image source={IMAGES.icon2} style={styles.iconImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Image source={IMAGES.icon3} style={styles.iconImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
};