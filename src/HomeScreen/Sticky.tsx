import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { styles } from "./styles";
import { IMAGES } from "./constants";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "./types";

export const Sticky: React.FC = React.memo(() => {
  const navigation = useNavigation<NavigationProp>();
  
  return (
    <View style={styles.stickyContainer}>
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Image source={IMAGES.home} style={styles.bottomNavImage} />
            <Text style={styles.bottomNavText}>Trang chủ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Image source={IMAGES.the} style={styles.bottomNavImage} />
            <Text style={styles.bottomNavText}>Thẻ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qrNavItem}  onPress={() => navigation.navigate("QRPage")} >
            <Image source={IMAGES.qr} style={styles.qrNavImage} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Image source={IMAGES.kc} style={styles.bottomNavImage} />
            <Text style={styles.bottomNavText}>Đặc quyền</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Image source={IMAGES.them} style={styles.bottomNavImage} />
            <Text style={styles.bottomNavText}>Thêm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});