import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from './types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';

const TransferSection = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.lightBlueSection}>
      <View style={styles.titleContainer}>
        <Text style={styles.transferTitle}>Chuyển tiền</Text>
        <TouchableOpacity style={styles.qrButton} onPress={() => navigation.navigate('QRPage')}>
           <Image
                    source={require('../screen/image/scan1.png')}
                    style={styles.backIconImage1}
                    resizeMode="contain"
                  />
        </TouchableOpacity>
      </View>
      <View style={styles.transferOptions}>
        <TouchableOpacity onPress={() => navigation.navigate('Bank')} style={styles.optionBox}>
          <Image style={styles.optionImage}   source={require('../screen/image/ct.png')}
                    resizeMode="contain"/>
          <Text style={styles.optionText}>Số tài khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBox}>
        <Image style={styles.optionImage}   source={require('../screen/image/phone.png')}
                    resizeMode="contain"/>
          <Text style={styles.optionText}>Số điện thoại</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBox}>
           <Image style={styles.optionImage}   source={require('../screen/image/the1.png')}
                    resizeMode="contain"/>
          <Text style={styles.optionText}>Số thẻ</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomOptions}>
        <TouchableOpacity style={styles.doubleWidthOption}>
          <Image style={styles.optionImage}   source={require('../screen/image/xu1.png')}
                    resizeMode="contain"/>
          <Text style={styles.optionText1}>Truy vấn giao dịch giá trị lớn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBox}>
           <Image style={styles.optionImage}   source={require('../screen/image/hand.png')}
                    resizeMode="contain"/>
          <Text style={styles.optionText}>Ví điện tử & Đối tác</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TransferSection;