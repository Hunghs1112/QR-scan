import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  UIManager,
  findNodeHandle
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './styles';
import { useThreeLogic } from './ThreeLogic';
import BankSelectorModal from './BankSelectorModal';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SvgXml } from 'react-native-svg';
import { useAuth } from '../Context/AuthContext';
import { Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const Three: React.FC = () => {
  const {
    recipientAccountNumber,
    setRecipientAccountNumber,
    recipientName,
    transferContent,
    setTransferContent,
    loading,
    selectedBank,
    setIsModalVisible,
    isModalVisible,
    banks,
    account_number,
    balance,
    handleContinue,
    formatVND,
    setSelectedBank,
  } = useThreeLogic();
  const { name } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [svgXml, setSvgXml] = useState<string | null>(null);
  const [rawAmount, setRawAmount] = useState<string>('');
  const [displayAmount, setDisplayAmount] = useState<string>('');
  const [isAmountInputFocused, setIsAmountInputFocused] = useState(false);
  const [isContentInputFocused, setIsContentInputFocused] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const amountInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);

  const formatNumberWithCommas = useCallback((value: string): string => {
    const digits = value.replace(/[^\d]/g, '');
    if (!digits) return '';
    return parseInt(digits).toLocaleString('en-US', { minimumFractionDigits: 0 });
  }, []);

  useEffect(() => {
    setTransferContent(name ? `${name} chuyen tien` : 'Khach Hang chuyen tien');
  }, [setTransferContent, name]);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        if (selectedBank?.icon_url) {
          const response = await fetch(selectedBank.icon_url);
          const data = await response.text();
          setSvgXml(data.trim().startsWith('<svg') ? data : null);
        } else {
          setSvgXml(null);
        }
      } catch {
        setSvgXml(null);
      }
    };
    fetchSvg();
  }, [selectedBank]);

const handleAmountChange = useCallback((text: string) => {
  // Lấy chỉ số
  const digitsOnly = text.replace(/[^\d]/g, '');
  setRawAmount(digitsOnly);

  // Nếu không có gì thì reset
  if (!digitsOnly) {
    setDisplayAmount('');
    return;
  }

  // Format nhưng đảm bảo dấu phẩy cố định (regex chia nhóm 3 số)
  const formatted = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  setDisplayAmount(formatted);

}, []);

  const handleContinuePress = useCallback(() => {
    handleContinue(rawAmount, transferContent);
  }, [rawAmount, transferContent, handleContinue]);

  const handleBackPress = useCallback(() => {
    setSelectedBank(null);
    setRecipientAccountNumber('');
    setRawAmount('');
    setDisplayAmount('');
    setTransferContent(name ? `${name} chuyen tien` : 'Khach Hang chuyen tien');
    navigation.navigate('Payment');
  }, [navigation, name, setTransferContent, setRecipientAccountNumber, setSelectedBank]);

  const scrollToInput = useCallback((ref: React.RefObject<any>) => {
    const nodeHandle = findNodeHandle(ref.current);
    if (nodeHandle) {
      UIManager.measure(nodeHandle, (_x, _y, _w, _h, _pageX, pageY) => {
        scrollViewRef.current?.scrollTo({ y: pageY - 100, animated: true });
      });
    }
  }, []);

  const handleAmountFocus = useCallback(() => {
    setIsAmountInputFocused(true);
    setTimeout(() => {
      scrollToInput(amountInputRef);
    }, 100);
  }, [scrollToInput]);

  const handleContentFocus = useCallback(() => {
    setIsContentInputFocused(true);
    setTimeout(() => {
      scrollToInput(contentInputRef);
    }, 100);
  }, [scrollToInput]);

  return (
    <SafeAreaView style={styles.background}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <View style={styles.mainContainer}>
          <View style={styles.headerSection}>
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={handleBackPress} style={styles.backIcon}>
                <Entypo name="chevron-small-left" size={24} color="#275285" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Chuyển tiền tới số tài khoản</Text>
            </View>
          </View>

          <View style={styles.scrollContainer}>
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Upper */}
              <View style={styles.upperContainer}>
                <Text style={styles.sectionTitle}>Nguồn chuyển tiền</Text>
                <View style={styles.sourceAccountBox}>
                  <Text style={styles.accountText}>
                    TÀI KHOẢN THANH TOÁN - {account_number || ''}
                  </Text>
                  <Text style={styles.balanceText}>
                    {balance !== undefined ? formatVND(balance.toString()) : '0'} VND
                  </Text>
                  <Entypo
                    name="chevron-small-down"
                    size={24}
                    color="#4e5db5"
                    style={styles.dropdownIcon}
                  />
                </View>
                <Text style={styles.sectionTitle}>Chuyển đến</Text>
                <View style={styles.transferBox}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setIsModalVisible(true)}
                    style={styles.bankSection}
                  >
                    <View style={styles.bankIcon}>
                      {selectedBank?.icon_url && svgXml ? (
                        <SvgXml xml={svgXml} width={32} height={32} />
                      ) : (
                        <Image
                          source={require('../screen/image/nh.png')}
                          style={styles.bankIcon}
                          resizeMode="contain"
                        />
                      )}
                    </View>
                    <View style={styles.inputWrapper}>
                      <View style={styles.bankSelector}>
                        <Text style={styles.bankText}>
                          {selectedBank ? selectedBank.name : 'Ngân hàng'}
                        </Text>
                      </View>
                      <Entypo
                        name="chevron-small-down"
                        size={24}
                        color="#4e5db5"
                        style={styles.bankDropdownIcon}
                      />
                    </View>
                  </TouchableOpacity>
                  <View style={styles.dashedLine} />
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
                    <View style={styles.dashedLine} />
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

              {/* Lower */}
              <View style={styles.lowerContainer}>
                <View
                  style={[
                    styles.amountSection,
                    isAmountInputFocused && { borderWidth: 1, borderColor: '#266fb6', borderRadius: 8 }
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => amountInputRef.current?.focus()}
                    style={styles.amountInputContainer}
                  >
                    <TextInput
                      ref={amountInputRef}
                      style={styles.amountInput}
                      value={displayAmount}
                      onChangeText={handleAmountChange}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#275285"
                      onFocus={handleAmountFocus}
                      onBlur={() => setIsAmountInputFocused(false)}
                    />
                    <Text style={styles.vndText}>VND</Text>
                  </TouchableOpacity>
                  {displayAmount && (
                    <TouchableOpacity
                      onPress={() => {
                        setRawAmount('');
                        setDisplayAmount('');
                      }}
                      style={styles.amountClearIconContainer}
                    >
                      <MaterialIcons name="close" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </View>

                <View
                  style={[
                    styles.contentInputContainer,
                    isContentInputFocused && { borderWidth: 1, borderColor: '#266fb6', borderRadius: 8 }
                  ]}
                >
                  <Text style={styles.contentLabel}>Nội dung chuyển khoản</Text>
                  <View style={styles.contentInputRow}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => contentInputRef.current?.focus()}
                      style={styles.inputWrapper}
                    >
                      <TextInput
                        ref={contentInputRef}
                        style={styles.contentInput}
                        value={transferContent}
                        onChangeText={setTransferContent}
                        keyboardType="default"
                        placeholder="Nội dung chuyển khoản"
                        placeholderTextColor="#999"
                        onFocus={handleContentFocus}
                        onBlur={() => setIsContentInputFocused(false)}
                      />
                    </TouchableOpacity>
                    {transferContent && (
                      <TouchableOpacity
                        onPress={() => {
                          setTransferContent('');
                        }}
                        style={styles.contentClearIconContainer}
                      >
                        <MaterialIcons name="close" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View
                  style={[
                    styles.buttonContainerWrapper,
                    {
                      marginTop:
                        isAmountInputFocused || isContentInputFocused
                          ? 10
                          : recipientName
                          ? 160
                          : 210,
                    },
                  ]}
                >
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={handleBackPress}
                    >
                      <Text style={styles.backButtonText}>Quay lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.continueButton}
                      onPress={handleContinuePress}
                      disabled={loading}
                    >
                      <Text style={styles.continueButtonText}>Tiếp tục</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>

        <BankSelectorModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          banks={banks}
          onSelectBank={setSelectedBank}
          loading={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Three;
