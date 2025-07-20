import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTransaction } from './Context/TransactionContext';
import { useBank } from './Context/BankContext';
import { useAuth } from './Context/AuthContext';
import { cashOut } from './apiService';

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

const Five = () => {
  const navigation = useNavigation<NavigationProp>();
  const { recipientAccountNumber, recipientName, amount, transferContent, setLoading, loading } = useTransaction();
  const { selectedBank } = useBank();
  const { account_number, name, balance, setBalance } = useAuth();

  const balanceInDollars = balance !== undefined ? balance / 100 : 0;
  const amountInCents = parseFloat(amount?.replace(/,/g, '') || '0') * 100;
  const remainingBalanceInCents = balance !== undefined ? balance - amountInCents : 0;
  const formattedTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' – ' + new Date().toLocaleDateString('vi-VN');

  const handleTransaction = async () => {
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
        username: name,
        account_number,
        amount: parsedAmount,
        recipient_name: recipientName,
        recipient_account_number: recipientAccountNumber,
      };
      const response = await cashOut(data);
      if (setBalance) {
        setBalance(response.balance * 100);
      }
      Alert.alert('Success', 'Rút tiền thành công!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', `Giao dịch thất bại: ${(error as any).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./image/cttc.png')} style={styles.topImage} />
      <Text style={styles.amountText}>
        {amount} VND
      </Text>
      <Text style={styles.dateTimeText}>{formattedTime}</Text>
      <Image source={require('./image/ten.png')} style={styles.nameImage} />
      <View style={styles.recipientContainer}>
        <Text style={styles.recipientName}>{recipientName || ''}</Text>
        <View style={styles.row}>
          <Image source={require('./image/mb2.png')} style={styles.mbIcon} />
          <Text style={styles.bankText}>
            {selectedBank ? `${selectedBank.name} (${selectedBank.code})` : 'Chưa chọn'} - {recipientAccountNumber}
          </Text>
        </View>
        <Text style={styles.transferContent}>{transferContent}</Text>
      </View>
      <Text style={styles.remainingBalanceText}>Số dư còn lại: {remainingBalanceInCents / 100} VND</Text>
      <Image source={require('./image/mbb3.png')} style={styles.bottomImage} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Thực hiện giao dịch khác</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  topImage: {
    width: 320,
    height: 270,
    resizeMode: 'contain',
    marginBottom: 20,
    top: -10,
    left: 50,
  },
  amountText: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#141ED2',
    marginBottom: 10,
    top: -85,
    left: 10,
  },
  dateTimeText: {
    fontSize: 17,
    color: 'gray',
    marginBottom: 20,
    top: -85,
    left: 10,
  },
  nameImage: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginBottom: 20,
    top: -100,
    left: 15,
  },
  bottomImage: {
    width: 320,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 40,
    top: -130,
    left: 0,
  },
  recipientContainer: {
    borderWidth: 1,
    borderColor: '#ADD8E6',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 30,
    top: -100,
    width: 360,
    height: 150,
    left: 0,
  },
  recipientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mbIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  bankText: {
    fontSize: 18,
    color: 'black',
  },
  transferContent: {
    marginTop: 5,
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  remainingBalanceText: {
    fontSize: 18,
    color: 'black',
    marginBottom: 20,
    top: -130,
    left: 10,
  },
  button: {
    backgroundColor: '#141ED2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
    left: 30,
    width: 350,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default Five;