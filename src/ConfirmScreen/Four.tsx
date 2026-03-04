import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { useFourLogic } from './FourLogic';
import { useBank } from '../Context/BankContext';
import { useLoading } from '../Context/LoadingContext'; // Import useLoading
import styles from './styles';
import ConfirmTransferModals from './ConfirmTransferModal';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Home: undefined;
  Payment: undefined;
  Bank: undefined;
  QRPage: undefined;
  Bill: undefined;
  Confirm: { success?: boolean };
  History: undefined;
  FaceScan: undefined;
};

const ConfirmTransferMain = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Confirm'>>();
  const {
    recipientAccountNumber,
    recipientName,
    amount,
    transferContent,
    selectedBank,
    username,
    account_number,
    name,
    balance,
    isModalVisible,
    setModalVisible,
    handleConfirm,
    handleOtpConfirm,
    formatVND,
    otp,
    digitalOtp,
    handleOtpInput,
    otpLoading,
    convertNumberToText,
    otpTimer,
    setDigitalOtp,
    setOtpTimer,
  } = useFourLogic();
  const { banks, renderBankLogo } = useBank();
  const { isLoading } = useLoading(); // Lấy isLoading từ LoadingContext

  // Trigger modal if returning from FaceScanPage with success
  useEffect(() => {
    if (route.params?.success) {
      setModalVisible(true);
      navigation.setParams({ success: undefined });
    }
  }, [route.params, setModalVisible, navigation]);

  // Tìm ngân hàng gửi (MB Bank)
  const senderBank = React.useMemo(() => banks.find((bank) => bank.code === 'MB'), [banks]);

  // Định dạng nội dung chuyển khoản mặc định nếu rỗng
  const displayTransferContent = React.useMemo(
    () => transferContent || (name ? `${name} chuyen tien` : 'Chuyển tiền'),
    [transferContent, name]
  );

  // Format tên người nhận: chuyển thành chữ hoa
  const formatRecipientName = React.useCallback((name: string): string => {
    if (!name) return 'N/A';
    return name.toUpperCase();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#2f5884" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận thông tin</Text>
      </View>

      {/* Nội dung */}
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.transactionCard}>
          {/* Số tiền giao dịch */}
          <View style={styles.transactionBlock}>
            <Text style={styles.title}>Số tiền giao dịch</Text>
            <Text style={styles.amount}>{amount ? `${formatVND(amount)} VND` : '0 VND'}</Text>
            <Text style={styles.subLabel}>{amount ? convertNumberToText(amount) : 'Không đồng'}</Text>
          </View>

          {/* Người chuyển */}
          <View style={styles.infoBlock}>
            <View style={styles.infoRow}>
              <Text style={styles.personLabel}>Người chuyển</Text>
              <View style={[styles.infoContainer, { flexDirection: 'row', alignItems: 'flex-start' }]}>
                <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  {senderBank ? (
                    renderBankLogo(senderBank.id, 50, 62, styles.bankIcon)
                  ) : (
                    <Image
                      source={require('../screen/image/nh.png')}
                      style={styles.bankIcon}
                      resizeMode="contain"
                    />
                  )}
                </View>
                <View>
                  <Text style={styles.infoTextBold}>{name ? name.toUpperCase() : 'N/A'}</Text>
                  <Text style={styles.infoText}>{account_number || 'N/A'}</Text>
                  <Text style={styles.bankNameText}>Ngân hàng TMCP Quân đội</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Người nhận */}
          <View style={styles.infoBlock1}>
            <View style={styles.infoRow1}>
              <Text style={styles.personLabel1}>Người nhận</Text>
              <View style={[styles.infoContainer1, { flexDirection: 'row', alignItems: 'flex-start' }]}>
                <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  {selectedBank ? (
                    renderBankLogo(selectedBank.id, 50, 62, styles.bankIcon)
                  ) : (
                    <Image
                      source={require('../screen/image/nh.png')}
                      style={styles.bankIcon}
                      resizeMode="contain"
                    />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text 
                    style={styles.infoTextBold1} 
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {formatRecipientName(recipientName || '')}
                  </Text>
                  <Text style={styles.infoText1}>{recipientAccountNumber || 'N/A'}</Text>
                  <Text style={styles.bankNameText1}>{selectedBank?.name || 'Ngân hàng'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Nội dung khác */}
          <View style={styles.infoBlock2}>
            <View style={styles.infoRow3}>
              <Text style={styles.label}>Nội dung chuyển khoản</Text>
              <Text style={styles.transferContentText}>{displayTransferContent}</Text>
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

        {/* Cảnh báo */}
        <View style={styles.warningBox}>
          <Image source={require('../screen/image/warn.png')} style={styles.warningIcon} resizeMode="contain" />
          <Text style={styles.warningText}>
            Vui lòng kiểm tra chính xác thông tin trước khi xác nhận giao dịch.
          </Text>
        </View>
      </ScrollView>

      {/* Nút xác nhận */}
      <View style={styles.buttonContainerWrapper}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.backButton, isLoading && { opacity: 0.6 }]} // Thêm hiệu ứng mờ khi loading
            onPress={() => navigation.goBack()}
            disabled={isLoading} // Sử dụng isLoading thay vì transactionLoading
          >
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, isLoading && { opacity: 0.6 }]} // Thêm hiệu ứng mờ khi loading
            onPress={handleConfirm}
            disabled={isLoading} // Sử dụng isLoading thay vì transactionLoading
          >
            <Text style={styles.confirmButtonText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Xác thực (PIN -> OTP) */}
      <ConfirmTransferModals
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        handleOtpConfirm={handleOtpConfirm}
        otpLoading={otpLoading}
        otp={otp}
        digitalOtp={digitalOtp}
        handleOtpInput={handleOtpInput}
        otpTimer={otpTimer}
        setDigitalOtp={setDigitalOtp}
        setOtpTimer={setOtpTimer}
      />
    </SafeAreaView>
  );
};

export default ConfirmTransferMain;