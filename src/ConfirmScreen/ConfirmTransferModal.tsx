import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated, Dimensions, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { pinModalStyles, otpModalStyles } from './ModalStyles';
import { PanResponder } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PIN_MODAL_HEIGHT = SCREEN_HEIGHT * 0.4;
const OTP_MODAL_HEIGHT = SCREEN_HEIGHT * 0.8;
const SWIPE_THRESHOLD = 100;

type ConfirmTransferModalsProps = {
  isModalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  handleOtpConfirm: () => void;
  otpLoading: boolean;
  otp: string;
  digitalOtp: string;
  handleOtpInput: (text: string) => void;
  otpTimer: number;
  setDigitalOtp: (value: string) => void;
  setOtpTimer: (value: number) => void;
};

const ConfirmTransferModals = forwardRef(({
  isModalVisible,
  setModalVisible,
  handleOtpConfirm,
  otpLoading,
  otp,
  digitalOtp,
  handleOtpInput,
  otpTimer,
  setDigitalOtp,
  setOtpTimer,
}: ConfirmTransferModalsProps, ref) => {
  const inputRef = useRef<TextInput>(null);
  const [isPinComplete, setIsPinComplete] = useState(false);
  const [step, setStep] = useState<'PIN' | 'OTP'>('PIN');

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Reset state khi đóng modal
  useEffect(() => {
    if (!isModalVisible) {
      handleOtpInput('');
      setIsPinComplete(false);
      setStep('PIN');
    }
  }, [isModalVisible, handleOtpInput]);

  // Hiệu ứng mở/đóng modal
  useEffect(() => {
    if (isModalVisible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isModalVisible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy >= 0,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
          opacity.setValue(1 - gestureState.dy / (step === 'PIN' ? PIN_MODAL_HEIGHT : OTP_MODAL_HEIGHT));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SWIPE_THRESHOLD) {
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: SCREEN_HEIGHT,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => setModalVisible(false));
        } else {
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              tension: 65,
              friction: 11,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const handlePinInput = (text: string) => {
    if (isPinComplete) return;
    const formatted = text.replace(/[^0-9]/g, '').slice(0, 6);
    handleOtpInput(formatted);
    if (formatted.length === 6) {
      setIsPinComplete(true);
      setDigitalOtp('76759528');
      setOtpTimer(100);
      Keyboard.dismiss();
      setStep('OTP'); // Chuyển step ngay khi nhập đủ PIN
    }
  };

  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={() => setModalVisible(false)}
      style={step === 'PIN' ? pinModalStyles.modal : otpModalStyles.modal}
      backdropOpacity={0.5}
      deviceHeight={SCREEN_HEIGHT}
      propagateSwipe
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, justifyContent: 'flex-end' }}
      >
        <Animated.View
          style={[
            step === 'PIN' ? pinModalStyles.modalContent : otpModalStyles.modalContent,
            {
              transform: [{ translateY }],
              height: step === 'PIN' ? PIN_MODAL_HEIGHT : OTP_MODAL_HEIGHT,
              opacity,
            },
          ]}
          {...panResponder.panHandlers}
        >
          {step === 'PIN' ? (
            <>
              <View style={pinModalStyles.dragHandle} />
              <Text style={pinModalStyles.modalTitle}>Xác thực Digital OTP</Text>
              <Text style={pinModalStyles.modalDescription}>
                Vui lòng nhập mã <Text style={pinModalStyles.modalDescriptionBold}>PIN Digital OTP</Text> để nhận mã xác thực giao dịch
              </Text>
              <View style={pinModalStyles.pinInputContainer}>
                {Array(6).fill(0).map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (!isPinComplete) {
                        inputRef.current?.focus();
                      }
                    }}
                    style={[
                      pinModalStyles.pinCircle,
                      index < otp.length && pinModalStyles.pinCircleFilled,
                    ]}
                  />
                ))}
                <TextInput
                  ref={inputRef}
                  style={pinModalStyles.minimalInput}
                  maxLength={6}
                  keyboardType="numeric"
                  value={otp}
                  onChangeText={handlePinInput}
                  showSoftInputOnFocus={true}
                  editable={!isPinComplete}
                />
              </View>
              <TouchableOpacity style={pinModalStyles.resetButton}>
                <Text style={pinModalStyles.resetButtonText}>Đặt lại mã PIN</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={otpModalStyles.dragHandle} />
              <View style={otpModalStyles.contentWrapper}>
                <Text style={otpModalStyles.modalTitle}>Xác thực Digital OTP</Text>
                <Text style={otpModalStyles.otpLabel}>Mã xác thực</Text>
                <View style={otpModalStyles.otpContainer}>
                  {digitalOtp.split('').map((digit, index) => (
                    <Text key={index} style={otpModalStyles.otpDigit}>
                      {digit}
                    </Text>
                  ))}
                </View>
                <Text style={otpModalStyles.otpTimer}>
                  Mã xác thực giao dịch (OTP) có hiệu lực trong vòng{' '}
                  <Text style={otpModalStyles.otpTimerHighlight}>{otpTimer} giây</Text>
                </Text>
                <Text style={otpModalStyles.autoFillText}>Bấm Xác thực để tự động điền mã</Text>
              </View>
              <TouchableOpacity
                style={[otpModalStyles.confirmButton, otpLoading && { opacity: 0.6 }]}
                onPress={handleOtpConfirm}
                disabled={otpLoading}
              >
                <Text style={otpModalStyles.confirmButtonText}>Xác thực</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

export default ConfirmTransferModals;