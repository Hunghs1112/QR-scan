import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated, Dimensions } from 'react-native';
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
  otpModalVisible: boolean;
  setOtpModalVisible: (visible: boolean) => void;
  handleOtpConfirm: () => void;
  otpLoading: boolean;
  otp: string;
  digitalOtp: string;
  handleOtpInput: (text: string) => void;
  otpTimer: number;
};

const ConfirmTransferModals = forwardRef(({
  isModalVisible,
  setModalVisible,
  otpModalVisible,
  setOtpModalVisible,
  handleOtpConfirm,
  otpLoading,
  otp,
  digitalOtp,
  handleOtpInput,
  otpTimer,
}: ConfirmTransferModalsProps, ref) => {
  const inputRef = useRef<TextInput>(null);

  const pinTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const pinOpacity = useRef(new Animated.Value(0)).current;

  const otpTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const otpOpacity = useRef(new Animated.Value(0)).current;

  // Reset PIN khi đóng modal
  useEffect(() => {
    if (!isModalVisible) {
      handleOtpInput('');
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (!otpModalVisible) {
      handleOtpInput('');
    }
  }, [otpModalVisible]);

  // Hiệu ứng mở/đóng modal PIN
  useEffect(() => {
    if (isModalVisible) {
      Animated.parallel([
        Animated.spring(pinTranslateY, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(pinOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(pinTranslateY, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pinOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isModalVisible]);

  // Hiệu ứng mở/đóng modal OTP
  useEffect(() => {
    if (otpModalVisible) {
      Animated.parallel([
        Animated.spring(otpTranslateY, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(otpOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(otpTranslateY, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(otpOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [otpModalVisible]);

  const pinPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy >= 0,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          pinTranslateY.setValue(gestureState.dy);
          pinOpacity.setValue(1 - gestureState.dy / PIN_MODAL_HEIGHT);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SWIPE_THRESHOLD) {
          Animated.parallel([
            Animated.timing(pinTranslateY, {
              toValue: SCREEN_HEIGHT,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(pinOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => setModalVisible(false));
        } else {
          Animated.parallel([
            Animated.spring(pinTranslateY, {
              toValue: 0,
              tension: 65,
              friction: 11,
              useNativeDriver: true,
            }),
            Animated.timing(pinOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const otpPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy >= 0,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          otpTranslateY.setValue(gestureState.dy);
          otpOpacity.setValue(1 - gestureState.dy / OTP_MODAL_HEIGHT);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SWIPE_THRESHOLD) {
          Animated.parallel([
            Animated.timing(otpTranslateY, {
              toValue: SCREEN_HEIGHT,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(otpOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => setOtpModalVisible(false));
        } else {
          Animated.parallel([
            Animated.spring(otpTranslateY, {
              toValue: 0,
              tension: 65,
              friction: 11,
              useNativeDriver: true,
            }),
            Animated.timing(otpOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  return (
    <>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={pinModalStyles.modal}
        backdropOpacity={0.5}
        deviceHeight={SCREEN_HEIGHT}
        propagateSwipe
      >
        <Animated.View
          style={[
            pinModalStyles.modalContent,
            { transform: [{ translateY: pinTranslateY }], height: PIN_MODAL_HEIGHT, opacity: pinOpacity },
          ]}
          {...pinPanResponder.panHandlers}
        >
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
                  inputRef.current?.focus();
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
              onChangeText={handleOtpInput}
              showSoftInputOnFocus={true}
            />
          </View>
          <TouchableOpacity style={pinModalStyles.resetButton}>
            <Text style={pinModalStyles.resetButtonText}>Đặt lại mã PIN</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>

      <Modal
        isVisible={otpModalVisible}
        onBackdropPress={() => setOtpModalVisible(false)}
        style={otpModalStyles.modal}
        backdropOpacity={0.5}
        deviceHeight={SCREEN_HEIGHT}
        propagateSwipe
      >
        <Animated.View
          style={[
            otpModalStyles.modalContent,
            { transform: [{ translateY: otpTranslateY }], height: OTP_MODAL_HEIGHT, opacity: otpOpacity },
          ]}
          {...otpPanResponder.panHandlers}
        >
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
        </Animated.View>
      </Modal>
    </>
  );
});

export default ConfirmTransferModals;