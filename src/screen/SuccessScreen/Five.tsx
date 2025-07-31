import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SvgXml } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTransaction } from '../../Context/TransactionContext';
import { useBank } from '../../Context/BankContext';
import { useAuth } from '../../Context/AuthContext';
import styles from './styles';
import { formatVND } from './formatVND';

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
  const { recipientAccountNumber, recipientName, amount, transferContent, loading, setRecipientAccountNumber, setRecipientName, setAmount, setAmountText, setTransferContent } = useTransaction();
  const { selectedBank, setSelectedBank } = useBank();
  const { account_number, name, balance } = useAuth();

  const [svgCache, setSvgCache] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const loadSvgs = async () => {
      const cache: Record<string, string | null> = {};
      const mbBank = { code: 'MB', id: 'MB', icon_url: 'https://example.com/mb.svg', name: 'Ngân hàng TMCP Quân đội' };
      if (mbBank && mbBank.icon_url) {
        try {
          const response = await fetch(mbBank.icon_url);
          const svgData = await response.text();
          if (svgData.trim().startsWith('<svg')) {
            cache[mbBank.id] = svgData;
          } else {
            cache[mbBank.id] = null;
          }
        } catch (error) {
          cache[mbBank.id] = null;
        }
      } else {
        cache['MB'] = null;
      }

      if (selectedBank && selectedBank.icon_url) {
        try {
          const response = await fetch(selectedBank.icon_url);
          const svgData = await response.text();
          if (svgData.trim().startsWith('<svg')) {
            cache[selectedBank.id] = svgData;
          } else {
            cache[selectedBank.id] = null;
          }
        } catch (error) {
          cache[selectedBank.id] = null;
        }
      } else if (selectedBank) {
        cache[selectedBank.id] = null;
      }

      setSvgCache(cache);
    };
    loadSvgs();
  }, [selectedBank]);

  const renderBankLogo = (bankId: string | undefined, bankCode: string) => {
    if (bankId && svgCache[bankId] && svgCache[bankId]!.startsWith('<svg')) {
      return <SvgXml xml={svgCache[bankId]!} width={36} height={36} style={styles.bankIcon} />;
    }
    return (
      <Image
        source={require('../image/nh.png')}
        style={styles.bankIcon}
        resizeMode="contain"
      />
    );
  };

  const balanceInDollars = balance !== undefined ? balance / 100 : 0;
  const amountInCents = parseFloat(amount?.replace(/,/g, '') || '0') * 100;
  const remainingBalanceInCents = balance !== undefined ? balance - amountInCents : 0;
  const formattedTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' – ' + new Date().toLocaleDateString('vi-VN');

  const handleAnotherTransaction = () => {
    setRecipientAccountNumber('');
    setRecipientName('');
    setAmount('0');
    setAmountText('');
    setTransferContent('CHUYEN TIEN');
    setSelectedBank(null);
    
    navigation.navigate('Bank');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Image source={require('../image/home.png')} style={styles.homeIcon} />
        </TouchableOpacity>

        <Image source={require('../image/tick.png')} style={styles.checkmarkIcon} />
        <Text style={styles.successText}>Chuyển tiền thành công</Text>
        <Text style={styles.amountText}>{amount ? formatVND(amount) : formatVND('10000')} VND</Text>
        <Text style={styles.dateTimeText}>{formattedTime}</Text>
        <Icon name="angle-double-down" size={24} color="#000" style={styles.arrowDownIcon} />
        <View style={styles.transactionBox}>
          <Text style={styles.recipientName}>{recipientName}</Text>
          <View style={styles.bankInfoRow}>
            {selectedBank ? renderBankLogo(selectedBank.id, selectedBank.code) : (
              <Image
                source={require('../image/nh.png')}
                style={styles.bankIcon}
                resizeMode="contain"
              />
            )}
            <Text style={styles.bankText}>{selectedBank?.name || ''}</Text>
          </View>
          <Text style={styles.accountNumberText}>{recipientAccountNumber || '8810681618'}</Text>
          <Text style={styles.descriptionText}>{transferContent || 'chuyen tien'}</Text>
          <View style={styles.transactionBoxArrowContainer}>
            <Icon name="chevron-down" size={14} color="#000" style={styles.transactionBoxArrow} />
          </View>
        </View>

        <Text style={styles.thankYouText}>Cảm ơn bạn đã sử dụng dịch vụ của MB Bank</Text>
        <Image source={require('../image/logoP.png')} style={styles.mbBankLogo} />

        <View style={styles.actionButtonsContainer}>
          <View style={styles.actionButtonWrapper}>
            <TouchableOpacity style={styles.actionButton}>
              <Image source={require('../image/home.png')} style={styles.actionIcon} />
            </TouchableOpacity>
            <Text style={styles.actionButtonText}>Chia sẻ</Text>
          </View>
          <View style={styles.actionButtonWrapper}>
            <TouchableOpacity style={styles.actionButton}>
              <Image source={require('../image/home.png')} style={styles.actionIcon} />
            </TouchableOpacity>
            <Text style={styles.actionButtonText}>Lưu ảnh</Text>
          </View>
          <View style={styles.actionButtonWrapper}>
            <TouchableOpacity style={styles.actionButton}>
              <Image source={require('../image/home.png')} style={styles.actionIcon} />
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