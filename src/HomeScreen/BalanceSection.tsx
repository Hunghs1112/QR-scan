import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { styles } from './styles';
import { IMAGES } from './constants';
import { useUser } from '../Context/UserContext'; // Import UserContext

interface BalanceSectionProps {
  balance: number | undefined;
  isBalanceVisible: boolean;
  handleEyeClick: () => void;
  formatVND: (value: number) => string;
}

export const BalanceSection: React.FC<BalanceSectionProps> = ({
  balance,
  isBalanceVisible,
  handleEyeClick,
  formatVND,
}) => {
  const { userImage, isLoadingImage } = useUser(); // Use UserContext

  return (
    <View style={styles.balanceSectionContainer}>
      <View style={styles.balanceSection}>
        <View style={styles.balanceContainer}>
          <View style={styles.userContainer}>
            <View style={styles.avatar}>
              {isLoadingImage ? (
                <Text style={styles.loadingText}>Loading...</Text> // Display loading text
              ) : (
                <Image
                  source={userImage ? { uri: userImage } : IMAGES.user} // Use userImage or fallback
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              )}
              <Image source={IMAGES.shield} style={styles.shieldImage} />
            </View>
            <Image
  source={IMAGES.upgrade}
  style={styles.upgradeImage}
  defaultSource={IMAGES.upgrade} // Preload to help with animation
  resizeMode="contain"
/>
          </View>
          <View style={styles.balanceInfoContainer}>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceTitle}>Tổng số dư VND</Text>
              <TouchableOpacity style={styles.arrowButton}>
                <Feather name="chevron-right" size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEyeClick} style={styles.eyeButton}>
                <Feather name={isBalanceVisible ? 'eye' : 'eye-off'} size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.balanceAmount}>
                {isBalanceVisible && balance !== undefined ? formatVND(balance) : '*** ***'}
              </Text>
              <Text style={styles.balanceCurrency}> VND</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  ); 
};