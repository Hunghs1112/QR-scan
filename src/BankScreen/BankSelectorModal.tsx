import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './BankSelectorModalStyles';
import { useBankSelectorModalLogic } from './BankSelectorModalLogic';

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

const BankSelectorModal: React.FC<BankSelectorModalProps> = ({ visible, onClose, banks, onSelectBank, loading }) => {
  const { handleSelectBank, handleClose, searchQuery, setSearchQuery, filteredBanks } = useBankSelectorModalLogic({
    onClose,
    onSelectBank,
    banks,
  });

  const [svgCache, setSvgCache] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const loadSvgs = async () => {
      const cache: Record<string, string | null> = {};
      for (const bank of banks) {
        if (bank.icon_url) {
          try {
            const response = await fetch(bank.icon_url);
            const svgData = await response.text();
            cache[bank.id] = svgData.trim().startsWith('<svg') ? svgData : null;
            setSvgCache((prev) => ({ ...prev, [bank.id]: cache[bank.id] }));
          } catch (error) {
            cache[bank.id] = null;
            setSvgCache((prev) => ({ ...prev, [bank.id]: cache[bank.id] }));
          }
        } else {
          cache[bank.id] = null;
          setSvgCache((prev) => ({ ...prev, [bank.id]: cache[bank.id] }));
        }
      }
    };
    if (banks.length > 0) {
      loadSvgs();
    }
  }, [banks]);

  const renderBankItem = ({ item }: { item: Bank }) => (
    <TouchableOpacity style={styles.bankItem} onPress={() => handleSelectBank(item)}>
      <View style={styles.bankItemContent}>
        <View style={styles.bankItemRow}>
          {item.icon_url && svgCache[item.id] ? (
            svgCache[item.id]!.startsWith('<svg') ? (
              <SvgXml xml={svgCache[item.id]!} width={36} height={36} style={styles.bankIcon} />
            ) : (
              <Image
                source={require('../screen/image/nh.png')}
                style={styles.bankIcon}
                resizeMode="contain"
              />
            )
          ) : (
            <Image
              source={require('../screen/image/nh.png')}
              style={styles.bankIcon}
              resizeMode="contain"
            />
          )}
          <Text style={styles.bankItemText}>
            {item.short_name} ({item.code})
          </Text>
        </View>
        <Text style={styles.bankItemName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={handleClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Chọn ngân hàng</Text>
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
          <FlatList
            data={filteredBanks}
            renderItem={renderBankItem}
            keyExtractor={(item) => item.id}
            style={styles.bankList}
          />
        </View>
      </View>
    </Modal>
  );
};

export default BankSelectorModal;