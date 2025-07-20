import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, Image, TextInput, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback, Modal, FlatList, ActivityIndicator, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTransaction } from './Context/TransactionContext';
import { useBank } from './Context/BankContext';
import { useAuth } from './Context/AuthContext';

type RootStackParamList = {
  Main: undefined;
  Payment: undefined;
  Home: undefined;
  Bank: undefined;
  QRPage: undefined;
  Confirm: undefined;
  Bill: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const backgroundImage = require("./image/back3.jpg")

const Three = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    recipientAccountNumber,
    setRecipientAccountNumber,
    recipientName,
    setRecipientName,
    amount,
    setAmount,
    transferContent,
    setTransferContent,
    loading,
    setLoading,
  } = useTransaction();

  const { banks, setBanks, selectedBank, setSelectedBank } = useBank();
  const { account_number, balance, name } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const apiKey = 'c6b7d702-7d46-44d8-8d4b-9a5d2e0ac276key';
  const apiSecret = '8fbc5f31-dd43-4344-bcbb-79ae59fb8358secret';

  const fetchBanks = useCallback(async () => {
    if (banks.length > 0) return;
    setLoading(true);
    try {
      const response = await fetch('https://api.banklookup.net/bank/list');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log('Fetch Banks Response:', data);
      if (data.success) setBanks(data.data);
      else Alert.alert('Lỗi', 'Không thể tải danh sách ngân hàng.');
    } catch (error) {
      console.error('Error fetching banks:', error);
      Alert.alert('Lỗi', 'Lỗi kết nối đến máy chủ. Vui lòng kiểm tra URL hoặc kết nối internet.');
    } finally {
      setLoading(false);
    }
  }, [banks, setBanks, setLoading]);

  const fetchRecipientInfo = useCallback(async (accountNumber: string, bankCode: string) => {
    if (!bankCode || !accountNumber) return;
    setLoading(true);
    let timeoutId: NodeJS.Timeout;
    try {
      const response = await Promise.race([
        fetch('https://api.banklookup.net', {
          method: 'POST',
          headers: { 'x-api-key': apiKey, 'x-api-secret': apiSecret, 'Content-Type': 'application/json' },
          body: JSON.stringify({ bank: bankCode, account: accountNumber }),
        }),
        new Promise((_, reject) =>
          timeoutId = setTimeout(() => reject(new Error('Timeout')), 3000)
        )
      ]);

      clearTimeout(timeoutId);
      if (!(response instanceof Response)) throw response;
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('Fetch Recipient Info Response:', data);
      if (data.success && data.data?.ownerName) {
        setRecipientName(data.data.ownerName);
      } else if (data.message === 'Hết credit') {
        setRecipientName('Hết credit');
      } else {
        setRecipientName('Nguyen Van A');
      }
    } catch (error) {
      setRecipientName('Nguyen Van A');
    } finally {
      setLoading(false);
    }
  }, [apiKey, apiSecret, setRecipientName, setLoading]);

  const debounce = useCallback((func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const debouncedFetchRecipientInfo = useCallback(
    debounce((accountNumber: string, bankCode: string) => {
      fetchRecipientInfo(accountNumber, bankCode);
    }, 1000),
    [fetchRecipientInfo]
  );

  const handleAmountChange = useCallback((value: string) => {
    setAmount(value.replace(/,/g, ''));
  }, [setAmount]);

  const handleContinue = useCallback(() => {
    const parsedAmount = parseFloat(amount || '0');
    if (!recipientAccountNumber || !recipientName || !amount || parsedAmount <= 0 || !selectedBank || !account_number || !name) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin: số tài khoản người nhận, tên người nhận, số tiền hợp lệ, ngân hàng, và đảm bảo bạn đã đăng nhập.');
      return;
    }
    if (balance !== undefined && parsedAmount * 100 > balance) {
      Alert.alert('Lỗi', 'Số dư không đủ để thực hiện giao dịch!');
      return;
    }
    navigation.navigate('Confirm');
  }, [recipientAccountNumber, recipientName, amount, selectedBank, account_number, name, balance, navigation]);

  useEffect(() => {
    if (banks.length === 0) {
      fetchBanks();
    }
  }, [banks, fetchBanks]);

  useEffect(() => {
    if (recipientAccountNumber && selectedBank) {
      debouncedFetchRecipientInfo(recipientAccountNumber, selectedBank.code);
    } else {
      setRecipientName('');
    }
  }, [recipientAccountNumber, selectedBank, debouncedFetchRecipientInfo, setRecipientName]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={backgroundImage} style={styles.background}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
            <Text style={styles.backArrowText}>{''}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}></Text>
        </View>

        {/* Source Account Section */}
        <View style={styles.sourceSection}>
          <Text style={styles.sourceText}></Text>
          <View style={styles.sourceAccountBox}>
            <Text style={styles.accountText}>TÀI KHOẢN THANH TOÁN - {account_number || 'N/A'}</Text>
            <Text style={styles.balanceText}>{balance !== undefined ? balance / 100 : 0} VND</Text>
            <Image source={require('./image/db.png')} style={styles.dropdownIcon} resizeMode="contain" />
          </View>
        </View>

        {/* Transfer To Section */}
        <View style={styles.transferSection}>
          <Text style={styles.transferText}></Text>
          <View style={styles.transferBox}>
            <View style={styles.bankSection}>
              <Image source={require('./image/nh.png')} style={styles.bankIcon} />
              <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.bankSelector}>
                <Text style={styles.bankText}>{selectedBank ? selectedBank.name : 'Ngân hàng'}</Text>
                <Image source={require('./image/tich.png')} style={styles.bankDropdownIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>
            <View style={styles.dashedLine}></View>
            <View style={styles.accountInputSection}>
              <TextInput
                style={styles.accountInput}
                value={recipientAccountNumber}
                onChangeText={setRecipientAccountNumber}
                keyboardType="numeric"
                placeholder="Số tài khoản"
                placeholderTextColor="#999"
              />
              <Image source={require('./image/tt.png')} style={styles.contactIcon} resizeMode="contain" />
            </View>
            {loading ? (
              <ActivityIndicator size="small" color="#141ED2" style={styles.loadingIndicator} />
            ) : (
              recipientName ? (
                <Text style={styles.recipientNameText}>
                  {recipientName === 'Hết credit' || recipientName === 'Nguyen Van A' ? recipientName : `Tên: ${recipientName}`}
                </Text>
              ) : null
            )}
          </View>
        </View>

        {/* Amount Section */}
        <View style={styles.amountSection}>
          <TextInput
            style={styles.amountInput}
            value={amount === '0' ? '' : amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#141ED2"
            onFocus={() => setAmount('')}
          />
          <Text style={styles.vndText}>VND</Text>
        </View>

        {/* Transfer Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.contentLabel}>Nội dung chuyển tiền</Text>
          <View style={styles.contentInputContainer}>
            <TextInput
              style={styles.contentInput}
              value={transferContent}
              onChangeText={setTransferContent}
              placeholder="Nội dung chuyển tiền"
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => setTransferContent('')}>
              <Image source={require('./image/x.jpg')} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue} disabled={loading}>
            <Text style={styles.continueButtonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>

        {/* Bank Selection Modal */}
        <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chọn Ngân hàng</Text>
              {loading ? (
                <ActivityIndicator size="large" color="#141ED2" />
              ) : (
                <FlatList
                  data={banks}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.bankItem}
                      onPress={() => {
                        setSelectedBank(item);
                        setIsModalVisible(false);
                      }}
                    >
                      <Text style={styles.bankItemText}>{item.name} ({item.code})</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
              <TouchableOpacity style={styles.closeModalButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeModalText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingHorizontal: 20,
    top: -20
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  backArrow: {
    marginRight: 15,
  },
  backArrowText: {
    fontSize: 24,
    color: '#141ED2',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    color: '#141ED2',
    fontWeight: 'bold',
  },
  sourceSection: {
    top: 33,
    marginBottom: 20,
  },
  sourceText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 10,
  },
  sourceAccountBox: {
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 15,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountText: {
    color: '#141ED2',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  balanceText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    width: 20,
    height: 20,
  },
  transferSection: {
    top: 40,
    marginBottom: 20,
  },
  transferText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 10,
  },
  transferBox: {
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bankSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  bankIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  bankSelector: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  bankDropdownIcon: {
    width: 15,
    height: 15,
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    marginBottom: 15,
  },
  accountInputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  accountInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  contactIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  recipientNameText: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  loadingIndicator: {
    marginTop: 5,
  },
  amountSection: {
    backgroundColor: 'white',
    borderRadius: 0,
    height: 58,
    width: 360,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 33,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    top: 52,
    left: 5
  },
  amountInput: {
    color: '#141ED2',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    top:10,
  },
  vndText: {
    color: '#333',
    fontSize: 18,
    marginLeft: 10,
  },
  contentSection: {
    width: 360,
    left: 5,
    height: 68,
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 15,
    marginBottom: 146,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    top: 40,
  },
  contentLabel: {
    color: '#141ED2',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  closeIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 30,
    top: 40,
  },
  backButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#141ED2',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    minWidth: 120,
    left: -7,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#141ED2',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#141ED2',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    flex: 1,
    top: 2,
    height: 45,
    marginLeft: 15,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#141ED2',
  },
  bankItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bankItemText: {
    fontSize: 16,
  },
  closeModalButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#141ED2',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeModalText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Three;