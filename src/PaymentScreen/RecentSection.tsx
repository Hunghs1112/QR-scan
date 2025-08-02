import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useBank } from '../Context/BankContext';
import { recentContacts } from './constants';
import styles from './styles';
import { Contact } from './types';

const RecentSection = () => {
  const { renderBankLogo, banks } = useBank();

  const getBankIdByCode = (bankCode: string) => {
    const bank = banks.find((b) => b.code === bankCode);
    return bank ? bank.id : bankCode;
  };

  return (
    <View style={styles.recentSection}>
      <Text style={styles.sectionTitle}>Gần đây</Text>
      <FlatList
        horizontal
        data={recentContacts}
        renderItem={({ item }: { item: Contact }) => (
          <View style={styles.avatarContainer}>
            {renderBankLogo(getBankIdByCode(item.bankId), 36, 36, styles.avatar)}
            <Text style={styles.avatarName}>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.avatarList}
      />
    </View>
  );
};

export default RecentSection;