import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";
import { IMAGES } from "./constants";
import type { NavigationProp } from "./types";

export const QuickActionsSection: React.FC = React.memo(() => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.quickActionsSectionContainer}>
      <View style={styles.quickActionsSection}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          <TouchableOpacity style={styles.serviceItem} onPress={() => navigation.navigate("Payment")}>
            <View style={styles.serviceIconContainer}>
              <Image source={IMAGES.pay} style={styles.serviceImage} />
            </View>
            <Text style={styles.serviceText}>Chuyển tiền</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.serviceIconContainer}>
              <Image source={IMAGES.dt} style={styles.serviceImage} />
            </View>
            <Text style={styles.serviceText}>Nạp tiền điện thoại</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.serviceIconContainer}>
              <Image source={IMAGES.lon} style={styles.serviceImage} />
              <Image source={IMAGES.overlayTienGui} style={styles.overlayImage} />
            </View>
            <Text style={styles.serviceText}>Tiền gửi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.serviceIconContainer}>
              <Image source={IMAGES.xu} style={styles.serviceImage} />
              <Image source={IMAGES.overlayVayNhanh} style={styles.overlayImage} />
            </View>
            <Text style={styles.serviceText}>Vay nhanh</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});