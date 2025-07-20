import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTransaction } from './Context/TransactionContext';
import { useBank } from './Context/BankContext';
import { useAuth } from './Context/AuthContext';
import { cashOut } from './apiService';
import NotifService from './NotifService'; // Import your notification service

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

const Four: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { recipientAccountNumber, recipientName, amount, transferContent, setLoading, loading } = useTransaction();
  const { selectedBank } = useBank();
  const { username, account_number, name, balance, setBalance } = useAuth();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [otpModalVisible, setOtpModalVisible] = useState<boolean>(false);

  const handleConfirm = (): void => {
    setModalVisible(false);
    setOtpModalVisible(true);
  };

  const handleOtpConfirm = async (): Promise<void> => {
    setLoading(true);
    try {
      const parsedAmount = parseFloat(amount?.replace(/,/g, '') || '0');
      if (!account_number || !name || !recipientAccountNumber || !recipientName || parsedAmount <= 0) {
        throw new Error('Vui lòng cung cấp đầy đủ thông tin: tài khoản, số tài khoản, số tiền, tên người nhận và số tài khoản người nhận!');
      }
      if (balance !== undefined && parsedAmount * 100 > balance) {
        throw new Error('Số dư không đủ để thực hiện giao dịch!');
      }
      const data = {
        username,
        account_number,
        amount: parsedAmount,
        recipient_name: recipientName,
        recipient_account_number: recipientAccountNumber,
      };
      console.log('cashOut request body:', JSON.stringify(data, null, 2));
      const response = await cashOut(data);
      if (setBalance) {
        setBalance(response.balance * 100);
      }

      // Format notification content
      const maskedAccount = `${account_number.slice(0, 2)}xxx${account_number.slice(-4)}`;
      const formattedAmount = `-${parsedAmount.toLocaleString('vi-VN')}VND`;
      const now = new Date();
      const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear().toString().slice(-2)} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const balanceVND = (response.balance / 100).toLocaleString('vi-VN');
      const maskedRecipientAccount = `MS00T${recipientAccountNumber.slice(-8)}`;
      const transactionCode = Math.random().toString(36).substring(2, 10).toUpperCase(); // Random 8-char code
      const message = `TK:${maskedAccount}| GD: ${formattedAmount} ${formattedDate}| SD: ${balanceVND}VND| DEN: ${recipientName} –${maskedRecipientAccount}|ND: ${transactionCode} - Ma giao dich/ Trace ${Math.floor(Math.random() * 1000000)}`;

      // Trigger local notification on successful transaction
      NotifService.sendLocalNotification('Giao dịch thành công', message);

      setOtpModalVisible(false);
      
      navigation.navigate('Bill');
    } catch (error) {
      console.error('cashOut error:', (error as any).message);
      Alert.alert('Error', `Giao dịch thất bại: ${(error as any).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./image/xntt.jpg')} style={styles.topImage} />
      <View style={styles.rectangle}>
        <Text style={styles.label}>Số tiền giao dịch</Text>
        <Text style={styles.amountText}>{amount} VND</Text>
        <View style={styles.line}></View>

        <Text style={styles.grayText}>Người chuyển</Text>
        <View style={styles.row}>
          <Image source={require('./image/mb2.png')} style={styles.bankIconCentered} />
          <View style={styles.transferInfo}>
            <Text style={styles.bankText}>{name || ''}</Text>
            <Text style={styles.accountText}>{account_number || 'N/A'}</Text>
            <Text style={styles.grayBankText}>Ngân hàng TMCP Quân đội</Text>
          </View>
        </View>

        <Text style={styles.grayText}>Người nhận</Text>
        <View style={styles.row}>
          <Image source={require('./image/mb2.png')} style={styles.bankIconCentered} />
          <View style={styles.transferInfo}>
            <Text style={styles.bankText}>{recipientName || ''}</Text>
            <Text style={styles.accountText}>{recipientAccountNumber}</Text>
            <Text style={styles.grayBankText}>{selectedBank ? `${selectedBank.name} (${selectedBank.code})` : 'Chưa chọn'}</Text>
          </View>
        </View>

        <View style={styles.line}></View>

        <View style={styles.row}>
          <Text style={styles.grayText}>Nội dung chuyển tiền:</Text>
        </View>
        <View style={styles.rowRightAligned}>
          <Text style={styles.boldText}>{transferContent || 'Không có nội dung'}</Text>
        </View>

        <View style={styles.whiteSpace}></View>

        <View style={styles.rowSpaceBetween}>
          <Text style={styles.grayText}>Phí giao dịch:</Text>
          <Text style={styles.boldTextFixed}>Miễn phí</Text>
        </View>

        <View style={styles.whiteSpace}></View>

        <View style={styles.rowSpaceBetween}>
          <Text style={styles.grayText}>Hình thức chuyển tiền:</Text>
          <Text style={styles.boldTextFixed}>Trong MB</Text>
        </View>
      </View>

      <Image source={require('./image/vlkt.png')} style={styles.bottomImage} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={loading}>
          <Text style={styles.confirmButtonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <View style={styles.dragIndicator}></View>
            <Text style={styles.modalTitle}>Xác thực Digital OTP</Text>
            <Text style={styles.modalDescription}>
              Vui lòng nhập mã PIN Digital OTP để nhận mã xác thực giao dịch
            </Text>

            <View style={styles.pinInputContainer}>
              {Array(6).fill('').map((_, index) => (
                <TextInput
                  key={index}
                  style={styles.pinInput}
                  maxLength={1}
                  keyboardType="numeric"
                />
              ))}
            </View>

            <TouchableOpacity style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Đặt lại mã PIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={otpModalVisible}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác thực Digital OTP</Text>
            <Text style={styles.otpLabel}>Mã xác thực</Text>
            <Text style={styles.otpCode}></Text>
            <Text style={styles.otpTimer}>Mã xác thực giao dịch (OTP) có hiệu lực trong 100 giây</Text>
            <Text style={styles.autoFillText}>Bấm Xác thực để tự động hóa điền mã</Text>
            <TouchableOpacity style={styles.confirmButton} onPress={handleOtpConfirm} disabled={loading}>
              <Text style={styles.confirmButtonText}>Xác thực</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  topImage: {
    width: 510,
    height: 100,
    resizeMode: 'cover',
    marginBottom: 10,
    top: 15,
    left: 40,
  },
  rectangle: {
    marginTop: 10,
    width: '90%',
    borderWidth: 2,
    borderColor: '#141ED2',
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    height: 570,
  },
  label: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
  amountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#141ED2',
    marginBottom: 10,
  },
  line: {
    borderBottomWidth: 1,
    borderColor: '#141ED2',
    marginVertical: 10,
  },
  grayText: {
    color: 'gray',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'left',
  },
  grayBankText: {
    color: 'gray',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'left',
  },
  bankIconCentered: {
    width: 35,
    height: 35,
    alignSelf: 'center',
    marginRight: 10,
  },
  transferInfo: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  bankText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  accountText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  rowRightAligned: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
  },
  boldTextFixed: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
    width: 100,
  },
  whiteSpace: {
    height: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
    width: '90%',
    top: 20,
  },
  backButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#141ED2',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#141ED2',
    fontSize: 22,
  },
  confirmButton: {
    backgroundColor: '#141ED2',
    borderRadius: 20,
    width: 230,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 22,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    height: '66%',
    justifyContent: 'flex-start',
  },
  dragIndicator: {
    width: 50,
    height: 5,
    backgroundColor: 'black',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 24,
    color: '#141ED2',
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 30,
  },
  pinInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  pinInput: {
    width: 20,
    height: 30,
    borderWidth: 1,
    borderColor: '#141ED2',
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 100,
    marginHorizontal: 15,
  },
  resetButton: {
    marginTop: 10,
  },
  resetButtonText: {
    color: '#141ED2',
    fontSize: 16,
    textAlign: 'center',
  },
  otpLabel: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
  otpCode: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#141ED2',
    marginBottom: 10,
  },
  otpTimer: {
    fontSize: 16,
    color: '#141ED2',
    marginBottom: 10,
  },
  autoFillText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 30,
  },
  bottomImage: {
    width: 370,
    height: 60,
    resizeMode: 'cover',
    marginTop: 20,
  },
});

export default Four;