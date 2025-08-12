import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Image, TextInput, PanResponder, Animated, Dimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './BankSelectorModalStyles';
import { useBankSelectorModalLogic } from './BankSelectorModalLogic';
import { useBank } from '../Context/BankContext';

interface Bank {
  id: string;
  name: string;
  code: string;
  short_name: string;
  icon_url?: string;
}

interface BankSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  banks: Bank[];
  onSelectBank: (bank: Bank) => void;
  loading: boolean;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const BankSelectorModal: React.FC<BankSelectorModalProps> = ({ visible, onClose, banks, onSelectBank, loading }) => {
  const { handleSelectBank, handleClose, searchQuery, setSearchQuery, filteredBanks } = useBankSelectorModalLogic({
    onClose,
    onSelectBank,
    banks,
  });
  const { renderBankLogo } = useBank();

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const modalHeight = SCREEN_HEIGHT * 0.7; // Modal chiếm 70% chiều cao màn hình

  // Hiệu ứng mở modal
  useEffect(() => {
    if (visible) {
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
  }, [visible]);

  // PanResponder để kéo modal xuống để đóng
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
          opacity.setValue(1 - gestureState.dy / modalHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > modalHeight * 0.3) {
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
          ]).start(() => handleClose());
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            tension: 65,
            friction: 11,
            useNativeDriver: true,
          }).start();
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const renderBankItem = ({ item }: { item: Bank }) => (
    <TouchableOpacity style={styles.bankItem} onPress={() => handleSelectBank(item)}>
      <View style={styles.bankItemContent}>
        <View style={styles.bankItemRow}>
          {renderBankLogo(item.id, 36, 36, styles.bankIcon)}
          <Text style={styles.bankItemText}>
            {item.short_name} ({item.code})
          </Text>
        </View>
        <Text style={styles.bankItemName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal animationType="none" transparent={true} visible={visible} onRequestClose={handleClose}>
      <Animated.View style={[styles.modalBackground, { opacity }]}>
        <Animated.View
          style={[styles.modalContent, { transform: [{ translateY }], maxHeight: modalHeight }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handleBar} />
          <View style={styles.header}>
            <Text style={styles.headerText}>Chọn ngân hàng</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm ngân hàng..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredBanks}
              renderItem={renderBankItem} // Sửa từ renderItem thành renderBankItem
              keyExtractor={(item) => item.id}
              style={styles.bankList}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default BankSelectorModal;