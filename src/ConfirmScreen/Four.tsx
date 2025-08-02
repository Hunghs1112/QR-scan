import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { useFourLogic } from './FourLogic';
import { useBank } from '../Context/BankContext';
import styles from './styles';
import ConfirmTransferModals from './ConfirmTransferModal';

const ConfirmTransferMain = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

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
    otpTimer,
  } = useFourLogic();

  const { banks, renderBankLogo } = useBank();

  const formatTransferContent = useCallback((content: string | undefined) => {
    const defaultContent = `${name || 'NGUYEN VAN A'} chuyen tien`;
    const text = content || defaultContent;
    const words = text.trim().split(' ');
    if (words.length <= 2) return text.toUpperCase();

    const namePart = words.slice(0, -2).join(' ').toUpperCase();
    const nonNamePart = words.slice(-2).join(' ');
    return `${namePart} ${nonNamePart}`;
  }, [name]);

  const senderBank = useMemo(() => banks.find((bank) => bank.code === 'MB'), [banks]);

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
                  {renderBankLogo(senderBank?.id, 50, 62, styles.bankIcon)}
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
                  {renderBankLogo(selectedBank?.id, 50, 62, styles.bankIcon)}
                </View>
                <View>
                  <Text style={styles.infoTextBold1}>{(recipientName || 'NGUYEN VAN FF').toUpperCase()}</Text>
                  <Text style={styles.infoText1}>{recipientAccountNumber || '8810681618'}</Text>
                  <Text style={styles.bankNameText1}>{selectedBank?.name || 'Ngân hàng'}</Text>
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