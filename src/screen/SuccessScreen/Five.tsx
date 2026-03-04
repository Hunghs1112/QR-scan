import React from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTransaction } from '../../Context/TransactionContext';
import { useBank } from '../../Context/BankContext';
import { useAuth } from '../../Context/AuthContext';
import styles from './styles';

type RootStackParamList = {
  Main: undefined;
  Payment: undefined;
  Home: undefined;
  Bank: undefined;
  QRPage: undefined;
  Confirm: undefined;
  Bill: undefined;
  Three: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TransactionSuccess = () => {
  const navigation = useNavigation<NavigationProp>();
  const { recipientAccountNumber, recipientName, amount, transferContent, loading, clearContext } = useTransaction();
  const { selectedBank, setSelectedBank, renderBankLogo } = useBank();
  const { account_number, name, balance } = useAuth();

  const formatVND = (value: string): string => {
    const num = parseFloat(value.replace(/[^0-9]/g, '')) || 0;
    return num > 0 ? num.toLocaleString('en-US') : '0';
  };

  // Format tên người nhận: chuyển thành chữ hoa
  const formatRecipientName = (name: string): string => {
    if (!name) return '';
    return name.toUpperCase();
  };

  const formattedTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' – ' + new Date().toLocaleDateString('vi-VN');

  const handleBackPress = () => {
    clearContext(); // Đặt lại toàn bộ TransactionContext
    setSelectedBank(null); // Đặt lại selectedBank
    navigation.navigate('Home'); // Điều hướng đến Bank
  };

  const handleAnotherTransaction = () => {
    clearContext();
    setSelectedBank(null);
    navigation.navigate('Bank');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f7fd', }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleBackPress} // Sử dụng handleBackPress thay vì navigate trực tiếp
        >
          <Image source={require('../image/home2.png')} style={styles.homeIcon} />
        </TouchableOpacity>
        <Image source={require('../image/tick.png')} style={styles.checkmarkIcon} />
        <Text style={styles.successText}>Chuyển tiền thành công</Text>
        <Text style={styles.amountText}>{amount ? formatVND(amount) : formatVND('10000')} VND</Text>
        <Text style={styles.dateTimeText}>{formattedTime}</Text>
        <Icon name="angle-double-down" size={24} color="#1B313E" style={styles.arrowDownIcon} />
        <View style={styles.transactionBox}>
          <Text 
            style={styles.recipientName}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {formatRecipientName(recipientName || '')}
          </Text>
          <View style={styles.bankInfoRow}>
            {renderBankLogo(selectedBank?.id, 36, 36, styles.bankIcon)}
            <Text style={styles.bankText}>{selectedBank?.short_name || 'Ngân hàng'}</Text>
          </View>
          <Text style={styles.accountNumberText}>{recipientAccountNumber || '8810681618'}</Text>
          <Text style={styles.descriptionText}>{transferContent || `${name || 'NGUYEN VAN A'} chuyen tien`}</Text>
          <View style={styles.transactionBoxArrowContainer}>
            <Icon name="chevron-down" size={14} color="#1B313E" style={styles.transactionBoxArrow} />
          </View>
        </View>
        <Text style={styles.thankYouText}>Cảm ơn bạn đã sử dụng dịch vụ của MB Bank</Text>
        <Image source={require('../image/logoP1.png')} style={styles.mbBankLogo} />
        <View style={styles.actionButtonsContainer}>
          <View style={styles.actionButtonWrapper}>
            <TouchableOpacity style={styles.actionButton}>
              <Image source={require('../image/share.png')} style={styles.actionIcon} />
            </TouchableOpacity>
            <Text style={styles.actionButtonText}>Chia sẻ</Text>
          </View>
          <View style={styles.actionButtonWrapper}>
            <TouchableOpacity style={styles.actionButton}>
              <Image source={require('../image/cam.png')} style={styles.actionIcon} />
            </TouchableOpacity>
            <Text style={styles.actionButtonText}>Lưu ảnh</Text>
          </View>
          <View style={styles.actionButtonWrapper}>
            <TouchableOpacity style={styles.actionButton}>
              <Image source={require('../image/save.png')} style={styles.actionIcon} />
            </TouchableOpacity>
            <Text style={styles.actionButtonText}>Lưu mẫu</Text>
          </View>
        </View>
        <View style={styles.bottomButtonContainer}>
          <View style={styles.applePayButtonContainer}>
            <TouchableOpacity style={styles.applePayButton}>
              <Text style={styles.applePayButtonText}>Liên kết tài khoản với</Text>
              <Image source={require('../image/apple.png')} style={styles.applePayIcon} />
            </TouchableOpacity>
            <View style={styles.discountLabel}>
              <Text style={styles.discountText}>HOÀN 150K</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.anotherTransactionButton}
            onPress={handleAnotherTransaction}
            disabled={loading}
          >
            <Text style={styles.anotherTransactionButtonText}>Thực hiện giao dịch khác</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TransactionSuccess;