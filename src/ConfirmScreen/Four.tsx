import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SvgXml } from 'react-native-svg';
import styles from './styles';
import { useFourLogic } from './FourLogic';
import { useBank } from '../Context/BankContext';
import Icon from 'react-native-vector-icons/Feather';
import ConfirmTransferModals from './ConfirmTransferModal';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Home: undefined;
  Payment: undefined;
  Bank: undefined;
  QRPage: undefined;
  Bill: undefined;
  Confirm: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ConfirmTransferMain = () => {
  const {
    recipientAccountNumber,
    recipientName,
    amount,
    transferContent,
    transactionLoading,
    selectedBank,
    username,
    account_number,
    name,
    balance,
    isModalVisible,
    setModalVisible,
    otpModalVisible,
    setOtpModalVisible,
    handleConfirm,
    handleOtpConfirm,
    formatVND,
    otp,
    digitalOtp,
    handleOtpInput,
    otpLoading,
    convertNumberToText,
    otpTimer
  } = useFourLogic();
  const { banks } = useBank();
  const navigation = useNavigation<NavigationProp>();

  const [svgCache, setSvgCache] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const loadSvgs = async () => {
      const cache: Record<string, string | null> = {};
      const mbBank = banks.find((bank) => bank.code === 'MB');
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
  }, [banks, selectedBank]);

  const renderBankLogo = (bankId: string | undefined, bankCode: string) => {
    if (bankId && svgCache[bankId] && svgCache[bankId]!.startsWith('<svg')) {
      return <SvgXml xml={svgCache[bankId]!} width={50} height={62} style={styles.bankIcon} />;
    }
    return (
      <Image
        source={require('../screen/image/nh.png')}
        style={styles.bankIcon}
        resizeMode="contain"
      />
    );
  };

  const formatTransferContent = (content: string | undefined) => {
    const defaultContent = 'chuyen tien';
    const text = content || defaultContent;
    const words = text.split(' ');
    if (words.length <= 2) {
      return text.toUpperCase();
    }
    const namePart = words.slice(0, -2).join(' ').toUpperCase();
    const nonNamePart = words.slice(-2).join(' ');
    return `${namePart} ${nonNamePart}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#29557c" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận thông tin</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.transactionCard}>
          <View style={styles.transactionBlock}>
            <Text style={styles.title}>Số tiền giao dịch</Text>
            <Text style={styles.amount}>{amount ? formatVND(amount) : '0'} VND</Text>
            <Text style={styles.subLabel}>{amount ? convertNumberToText(amount) : 'Không Đồng'}</Text>
          </View>

          <View style={styles.infoBlock}>
            <View style={styles.infoRow}>
              <Text style={styles.personLabel}>Người chuyển</Text>
              <View style={[styles.infoContainer, { flexDirection: 'row', alignItems: 'flex-start' }]}>
                <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  {renderBankLogo(banks.find((bank) => bank.code === 'MB')?.id, 'MB')}
                </View>
                <View>
                  <Text style={styles.infoTextBold}>{(name || 'NGUYEN VAN C').toUpperCase()}</Text>
                  <Text style={styles.infoText}>{account_number || '0911967363'}</Text>
                  <Text style={styles.bankNameText}>Ngân hàng TMCP Quân đội</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.infoBlock1}>
            <View style={styles.infoRow1}>
              <Text style={styles.personLabel1}>Người nhận</Text>
              <View style={[styles.infoContainer1, { flexDirection: 'row', alignItems: 'flex-start' }]}>
                <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  {selectedBank ? renderBankLogo(selectedBank.id, selectedBank.code) : (
                    <Image
                      source={require('../screen/image/nh.png')}
                      style={styles.bankIcon}
                      resizeMode="contain"
                    />
                  )}
                </View>
                <View>
                  <Text style={styles.infoTextBold1}>{(recipientName || 'NGUYEN VAN FF').toUpperCase()}</Text>
                  <Text style={styles.infoText1}>{recipientAccountNumber || '8810681618'}</Text>
                  <Text style={styles.bankNameText1}>{selectedBank?.name || ''}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.infoBlock2}>
            <View style={styles.infoRow3}>
              <Text style={styles.label}>Nội dung chuyển tiền</Text>
              <Text style={styles.transferContentText}>{formatTransferContent(transferContent)}</Text>
            </View>
            <View style={styles.infoRow3}>
              <Text style={styles.label}>Phí giao dịch</Text>
              <Text style={styles.infoTextRight}>Miễn phí</Text>
            </View>
            <View style={styles.infoRow3}>
              <Text style={styles.label}>Hình thức chuyển tiền</Text>
              <Text style={styles.infoTextRight}>Napas247</Text>
            </View>
          </View>
        </View>

        <View style={styles.warningBox}>
          <Image source={require('../screen/image/warn.png')} style={styles.warningIcon} resizeMode='contain'/>
          <Text style={styles.warningText}>Vui lòng kiểm tra chính xác thông tin trước khi xác nhận giao dịch.</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={transactionLoading}>
            <Text style={styles.confirmButtonText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ConfirmTransferModals
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        otpModalVisible={otpModalVisible}
        setOtpModalVisible={setOtpModalVisible}
        handleOtpConfirm={handleOtpConfirm}
        otpLoading={otpLoading}
        otp={otp}
        digitalOtp={digitalOtp}
        handleOtpInput={handleOtpInput}
        otpTimer={otpTimer}
      />
    </SafeAreaView>
  );
};

export default ConfirmTransferMain;