import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './styles';
import { useThreeLogic } from './ThreeLogic';
import BankSelectorModal from './BankSelectorModal';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Keyboard } from 'react-native';
import { SvgXml } from 'react-native-svg';

const backgroundImage = require('../screen/image/back3.jpg');

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

const Three: React.FC = () => {
  const {
    recipientAccountNumber,
    setRecipientAccountNumber,
    recipientName,
    amount,
    transferContent,
    setTransferContent,
    loading,
    selectedBank,
    setIsModalVisible,
    isModalVisible,
    banks,
    account_number,
    balance,
    handleAmountChange,
    handleContinue,
    setSelectedBank,
    setAmount,
    formatVND,
  } = useThreeLogic();

  const navigation = useNavigation<NavigationProp>();
  const [svgXml, setSvgXml] = useState<string | null>(null);

  useEffect(() => {
    if (selectedBank?.icon_url) {
      fetch(selectedBank.icon_url)
        .then((response) => response.text())
        .then((data) => {
          if (data.trim().startsWith('<svg')) {
            setSvgXml(data);
          } else {
            setSvgXml(null);
          }
        })
        .catch((error) => {
          setSvgXml(null);
        });
    } else {
      setSvgXml(null);
    }
  }, [selectedBank]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground source={backgroundImage} style={styles.background}>
          <View style={styles.upperContainer}>
            <View style={styles.headerSection}>
              <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
                  <Entypo name="chevron-small-left" size={24} color="#275285" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chuyển tiền tới số tài khoản</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Nguồn chuyển tiền</Text>
            <View style={styles.sourceAccountBox}>
              <Text style={styles.accountText}>TÀI KHOẢN THANH TOÁN - {account_number || ''}</Text>
              <Text style={styles.balanceText}>{balance !== undefined ? formatVND(balance) : '989,771 VND'} VND</Text>
              <Entypo name="chevron-small-down" size={24} color="#4e5db5" style={styles.dropdownIcon} />
            </View>

            <Text style={styles.sectionTitle}>Chuyển đến</Text>
            <View style={styles.transferBox}>
              <View style={styles.bankSection}>
                <View style={styles.bankIcon}>
                  {selectedBank?.icon_url && svgXml ? (
                    <SvgXml xml={svgXml} width={32} height={32} style={styles.bankIcon} />
                  ) : (
                    <Image
                      source={require('../screen/image/nh.png')}
                      style={styles.bankIcon}
                      resizeMode="contain"
                    />
                  )}
                </View>
                <View style={styles.inputWrapper}>
                  <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.bankSelector}>
                    <Text style={styles.bankText}>{selectedBank ? selectedBank.name : 'Ngân hàng'}</Text>
                  </TouchableOpacity>
                  <Entypo name="chevron-small-down" size={24} color="#4e5db5" style={styles.bankDropdownIcon} />
                </View>
              </View>
              <View style={styles.dashedLine}></View>
              <View style={styles.accountInputSection}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.accountInput}
                    value={recipientAccountNumber}
                    onChangeText={setRecipientAccountNumber}
                    keyboardType="numeric"
                    placeholder="Số tài khoản"
                    placeholderTextColor="#999"
                  />
                  <Image
                    source={require('../screen/image/danhba.png')}
                    style={styles.contactIcon}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
            {recipientName && (
              <View style={styles.recipientContainer}>
                <View style={styles.dashedLine}></View>
                <View style={styles.recipientNameSection}>
                  <Text style={styles.recipientNameText}>{recipientName}</Text>
                  <TouchableOpacity style={styles.saveButton}>
                    <MaterialIcons name="bookmark" size={16} color="#266fb6" />
                    <Text style={styles.saveButtonText}>Lưu</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <View style={styles.lowerContainer}>
            <View style={styles.amountSection}>
              <TextInput
                style={styles.amountInput}
                value={amount ? formatVND(amount) : ''}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#999"
                onFocus={() => setAmount('')}
              />
              <Text style={styles.vndText}>VND</Text>
              {amount && (
                <TouchableOpacity onPress={() => setAmount('')} style={styles.amountClearIconContainer}>
                  <MaterialIcons name="close" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.contentInputContainer}>
              <Text style={styles.contentLabel}>Nội dung chuyển tiền</Text>
              <View style={styles.contentInputRow}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.contentInput}
                    value={transferContent}
                    onChangeText={setTransferContent}
                    placeholder="NGUYEN QUANG HUY chuyen tien"
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity onPress={() => setTransferContent('')} style={styles.contentClearIconContainer}>
                    <MaterialIcons name="close" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Payment')}>
                <Text style={styles.backButtonText}>Quay lại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.continueButton} onPress={handleContinue} disabled={loading}>
                <Text style={styles.continueButtonText}>Tiếp tục</Text>
              </TouchableOpacity>
            </View>
          </View>
          <BankSelectorModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            banks={banks}
            onSelectBank={setSelectedBank}
            loading={false}
          />
        </ImageBackground>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Three;