import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from './types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';

const Header = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialIcons name="chevron-left" size={32} color="#2f5884" />
      </TouchableOpacity>
      <View style={styles.headerRight}>
        <TouchableOpacity>
         <Image
          source={require('../screen/image/chuong2.png')}
          style={styles.backIconImage}
          resizeMode="contain"
        />
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeIcon}>
          <Image
          source={require('../screen/image/home2.png')}
          style={styles.backIconImage}
          resizeMode="contain"
        />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;