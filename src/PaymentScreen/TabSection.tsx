import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

const TabSection = () => {
  return (
    <View style={styles.whiteSection}>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tabButton, styles.tabActive]}>
          <Text style={styles.tabTextActive}>Đã lưu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, styles.tabInactive]}>
          <Text style={styles.tabTextInactive}>Mẫu chuyển tiền</Text>
        </TouchableOpacity>
      </View>
 <View style={styles.searchBar}>
  <View style={styles.searchImage}>
    <Image
      style={styles.searchIcon}
      source={require('../screen/image/kinh1.png')}
      resizeMode="contain" // Use resizeMode instead of objectFit
    />
  </View>
  <Text style={styles.searchPlaceholder}>Tìm theo tên, số tài khoản</Text>
</View>
    </View>
  );
};

export default TabSection;