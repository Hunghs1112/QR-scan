import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";
import { IMAGES } from "./constants";
import type { NavigationProp } from "./types";

export const Header: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.headerOneContainer}>
      <View style={styles.headerOne}>
        <View style={styles.logomb}>
          <Image source={IMAGES.logo} style={styles.logoImage} />
        </View>
        <View style={styles.headerOneIcons}>
          <TouchableOpacity style={styles.headerOneIcon}>
           
              <Image source={IMAGES.icon4} style={styles.logoImage1} />
            
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerOneIcon}>
           
              <Image source={IMAGES.icon1} style={styles.logoImage1} />
       
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerOneIcon}  onPress={() => navigation.navigate("History")} >
           
              <Image source={IMAGES.icon2} style={styles.logoImage1} />
        
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerOneIcon}>
            
              <Image source={IMAGES.icon3} style={styles.logoImage1} />
          
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};