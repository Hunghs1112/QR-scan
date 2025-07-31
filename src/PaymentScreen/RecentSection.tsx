import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, Alert } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { recentContacts } from './constants';
import styles from './styles';
import { Contact } from './types';

interface Bank {
  id: string;
  name: string;
  code: string;
  short_name: string;
  icon_url?: string;
}

const RecentSection = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [svgCache, setSvgCache] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch('https://api.banklookup.net/bank/list');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetch Banks Response:', JSON.stringify(data, null, 2));
        if (data.success) {
          setBanks(data.data);

          // Tải SVG cho từng ngân hàng
          const cache: Record<string, string | null> = {};
          const fetchSvgPromises = data.data.map(async (bank: Bank) => {
            if (bank.icon_url) {
              try {
                const response = await fetch(bank.icon_url);
                const svgData = await response.text();
                console.log(`Nội dung SVG cho ${bank.name}:`, svgData.substring(0, 50));
                cache[bank.id] = svgData.trim().startsWith('<svg') ? svgData : null;
              } catch (error) {
                console.log(`Lỗi tải SVG cho ${bank.name}:`, error);
                cache[bank.id] = null;
              }
            } else {
              cache[bank.id] = null;
            }
            // Cập nhật svgCache từng bước khi một SVG tải xong
            setSvgCache((prev) => ({ ...prev, [bank.id]: cache[bank.id] }));
          });

          await Promise.all(fetchSvgPromises);
        } else {
          Alert.alert('Lỗi', 'Không thể tải danh sách ngân hàng.');
          setBanks([]);
        }
      } catch (error) {
        console.error('Error fetching banks:', error);
        Alert.alert('Lỗi', 'Lỗi kết nối đến máy chủ. Vui lòng kiểm tra URL hoặc kết nối internet.');
        setBanks([]);
      }
    };

    fetchBanks();
  }, []);

  const renderBankLogo = (bankCode: string) => {
    const bank = banks.find((b) => b.code === bankCode);
    const bankId = bank ? bank.id : bankCode;
    if (bankId && svgCache[bankId] && svgCache[bankId]!.startsWith('<svg')) {
      return <SvgXml xml={svgCache[bankId]!} width={36} height={36} style={styles.avatar} />;
    }
    return (
      <Image
        source={require('../screen/image/nh.png')}
        style={styles.avatar}
        resizeMode="contain"
      />
    );
  };

  return (
    <View style={styles.recentSection}>
      <Text style={styles.sectionTitle}>Gần đây</Text>
      <FlatList
        horizontal
        data={recentContacts}
        renderItem={({ item }: { item: Contact }) => (
          <View style={styles.avatarContainer}>
            {renderBankLogo(item.bankId)}
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