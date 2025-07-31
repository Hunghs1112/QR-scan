import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { styles } from "./styles";
import { IMAGES } from "./constants";
export const GridSection: React.FC = () => {
  return (
    <View style={styles.gridSectionContainer}>
      <View style={styles.gridSection}>
        <Text style={styles.sectionTitle}>Mua sắm - Giải trí - Đầu tư</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          <TouchableOpacity style={styles.gridItem1}>
            <View style={styles.gridIconContainer}>
              <Image source={IMAGES.gridIcon1} style={styles.gridImage} />
            </View>
            <Text style={[styles.serviceText, { fontFamily: "Inter_18pt-ExtraLight" }]}>Vé số Vietlott</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem1}>
            <View style={styles.gridIconContainer}>
              <Image source={IMAGES.gridIcon2} style={styles.gridImage} />
            </View>
            <Text style={[styles.serviceText, { fontFamily: "Inter_18pt-ExtraLight" }]}>Data 4G/ Nạp tiền</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem1}>
            <View style={styles.gridIconContainer}>
              <Image source={IMAGES.gridIcon3} style={styles.gridImage} />
            </View>
            <Text style={[styles.serviceText, { fontFamily: "Inter_18pt-ExtraLight" }]}>Data 4G/Thẻ Game</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem1}>
            <View style={styles.gridIconContainer}>
              <Image source={IMAGES.gridIcon4} style={styles.gridImage} />
            </View>
            <Text style={[styles.serviceText, { fontFamily: "Inter_18pt-ExtraLight" }]}>IRIS - Nạp điện thoại</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem1}>
            <View style={styles.gridIconContainer}>
              <Image source={IMAGES.gridIcon5} style={styles.gridImage} />
            </View>
            <Text style={[styles.serviceText, { fontFamily: "Inter_18pt-ExtraLight" }]}>Megatek - Thẻ game...</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem1}>
            <View style={styles.gridIconContainer}>
              <Image source={IMAGES.gridIcon6} style={styles.gridImage} />
            </View>
            <Text style={[styles.serviceText, { fontFamily: "Inter_18pt-ExtraLight" }]}>Thanh toán hoá đơn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem1}>
            <View style={styles.gridIconContainer}>
              <Image source={IMAGES.gridIcon7} style={styles.gridImage} />
            </View>
            <Text style={[styles.serviceText, { fontFamily: "Inter_18pt-ExtraLight" }]}>Data 3G/4G - VPAY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem1}>
            <View style={styles.gridIconContainer}>
              <Image source={IMAGES.gridIcon8} style={styles.gridImage} />
            </View>
            <Text style={[styles.serviceText, { fontFamily: "Inter_18pt-ExtraLight" }]}>Xem thêm dịch vụ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};