"use client"

import type React from "react"
import { View, Text, TouchableOpacity, Image } from "react-native"
import Feather from "react-native-vector-icons/Feather"
import { styles } from "./styles"
import { IMAGES } from "./constants" // Assuming gifIcon is imported here
import { useUser } from "../Context/UserContext"

interface BalanceSectionProps {
  balance: number | undefined
  isBalanceVisible: boolean
  handleEyeClick: () => void
  formatVND: (value: number) => string
}

export const BalanceSection: React.FC<BalanceSectionProps> = ({
  balance,
  isBalanceVisible,
  handleEyeClick,
  formatVND,
}) => {
  const { userImage, isLoadingImage } = useUser()

  return (
    <View style={styles.balanceSectionContainer}>
      <View style={styles.balanceSection}>
        <View style={styles.balanceContainer}>
          <View style={styles.userContainer}>
            <View style={styles.avatar}>
              {isLoadingImage ? (
                <Text style={styles.loadingText}>Loading...</Text>
              ) : (
                <Image
                  source={userImage ? { uri: userImage } : IMAGES.user}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              )}
              <Image source={IMAGES.shield} style={styles.shieldImage} />
            </View>
            <Image
              source={IMAGES.upgrade}
              style={styles.upgradeImage}
              defaultSource={IMAGES.upgrade}
              resizeMode="contain"
            />
          </View>
          <View style={styles.balanceInfoContainer}>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceTitle}>Tổng số dư VND</Text>
              <Feather name="chevron-right" size={20} color="#FFF" />
              <TouchableOpacity onPress={handleEyeClick} style={styles.eyeButton}>
                <Feather name={isBalanceVisible ? "eye" : "eye-off"} size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text style={styles.balanceAmount}>
                {isBalanceVisible && balance !== undefined ? formatVND(balance) : "*** ***"}
              </Text>
              <Text style={styles.balanceCurrency}> VND</Text>
            </View>
            <TouchableOpacity style={styles.dailyInterestContainer}>
              <Image source={IMAGES.gifIcon} style={{ width: 24, height: 24 }} /> {/* Replaced trending-up */}
              <Text style={styles.dailyInterestText}>SINH LỜI MỖI NGÀY</Text>
              <Feather name="chevron-right" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}