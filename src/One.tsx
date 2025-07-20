"use client"
import type React from "react"
import { useState, useRef } from "react"
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
  Animated,
  
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useAuth } from "./Context/AuthContext"

// Define navigation stack param list
type RootStackParamList = {
  Login: undefined
  Main: undefined
  Home: undefined
  Payment: undefined
  Bank: undefined
  QRPage: undefined
  Bill: undefined
  Confirm: undefined
}

// Define navigation prop type
type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const backgroundImage = require("./image/back.jpg")
const { width, height } = Dimensions.get("window")

const One: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const { balance, account_number } = useAuth()
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [showLoadingArea, setShowLoadingArea] = useState<boolean>(false)
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current
  const pullDistance = useRef(new Animated.Value(0)).current
  const loadingOpacity = useRef(new Animated.Value(0)).current

  const handleEyeClick = (): void => {
    setIsBalanceVisible(!isBalanceVisible)
  }

  const handleRefresh = (): void => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y
    scrollY.setValue(offsetY)
    
    // Show loading area when scrolling up beyond threshold
    if (offsetY < -50 && !showLoadingArea) {
      setShowLoadingArea(true)
      Animated.timing(loadingOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start()
    } else if (offsetY >= -10 && showLoadingArea) {
      Animated.timing(loadingOpacity, {
        toValue: 0,
        duration: 200,  
        useNativeDriver: false,
      }).start(() => {
        setShowLoadingArea(false)
      })
    }
  }

  const formatBalance = (balance: number): string => {
    return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const serviceIcons = [
    { name: "Chuyển tiền", icon: "💸" },
    { name: "Nạp tiền\ndiện thoại", icon: "📱" },
    { name: "Tiền gửi", icon: "🐷" },
    { name: "Vay nhanh", icon: "💰" },
  ]

  const serviceGrid = [
    { name: "Vé số Vietlott", icon: "🎫", color: "#E53E3E" },
    { name: "Data 4G/\nNạp tiền", icon: "📶", color: "#3182CE" },
    { name: "Data 4G/Thẻ\nGame", icon: "🎮", color: "#805AD5" },
    { name: "IRIS - Nạp\ndiện thoại", icon: "📞", color: "#805AD5" },
    { name: "Megatek -\nThẻ game ...", icon: "🎯", color: "#805AD5" },
    { name: "Thanh toán\nhóa đơn", icon: "💳", color: "#3182CE" },
    { name: "Data 3G/4G\n- VPAY", icon: "📡", color: "#E53E3E" },
    { name: "Xem thêm\ndịch vụ", icon: "⋯", color: "#3182CE" },
  ]

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.mbLogo}>⭐ MB</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🔔</Text>
          </TouchableOpacity>
           <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🔔</Text>
          </TouchableOpacity>
           <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🔔</Text>
          </TouchableOpacity> <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showLoadingArea && (
        <Animated.View style={[styles.loadingArea, { opacity: loadingOpacity }]}>
          <View style={styles.loadingCircle}>
            <Text style={styles.loadingText}>⟳</Text>
          </View>
        </Animated.View>
      )}

      <ScrollView
        style={styles.scrollContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        <View style={styles.balanceSection}>
        
          <View style={styles.userIconSection}>
            <View style={styles.userIcon}>
              <Text style={styles.userIconText}>👤</Text>
            </View>
            <View style={styles.nangHangBadge}>
              <Text style={styles.nangHangText}>NÂNG HẠNG</Text>
            </View>
          </View>

        
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceTitle}>Tổng số dư VND</Text>
              <View style={styles.balanceActions}>
                <Text style={styles.chevronIcon}>›</Text>
                <TouchableOpacity onPress={handleEyeClick} style={styles.eyeButton}>
                  <Text style={styles.eyeIcon}>👁</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.balanceAmount}>
              {isBalanceVisible && balance !== undefined ? `${formatBalance(balance / 100)} VND` : "*** *** VND"}
            </Text>
          </View>
        </View>

        {/* Main White Container */}
        <View style={styles.mainContainer}>
          {/* Main Services */}
          <View style={styles.mainServices}> 
            <View style={styles.servicesGrid}>
              {serviceIcons.map((service, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.serviceItem}
                  onPress={service.name === "Chuyển tiền" ? () => navigation.navigate('Payment') : undefined}
                >
                  <View style={styles.serviceIconContainer}>
                    <Text style={styles.serviceIcon}>{service.icon}</Text>
                  </View>
                  <Text style={styles.serviceText}>{service.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Expand Button - Overlaying border */}
          <View style={styles.expandButtonContainer}>
            <TouchableOpacity style={styles.expandButton}>
              <Text style={styles.expandIcon}>⌄</Text>
            </TouchableOpacity>
          </View>

          {/* Image Slider */}
          <View style={styles.sliderSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageSlider}>
              <View style={styles.sliderItem}>
                <View style={styles.sliderImagePlaceholder}>
                  <Text style={styles.sliderImageText}>🎁</Text>
                </View>
                <Text style={styles.sliderText}>Xem tất cả khuyến mãi</Text>
              </View>
              <View style={styles.sliderItem}>
                <View style={styles.sliderImagePlaceholder}>
                  <Text style={styles.sliderImageText}>💎</Text>
                </View>
                <Text style={styles.sliderText}>Ưu đãi đặc biệt</Text>
              </View>
              <View style={styles.sliderItem}>
                <View style={[styles.sliderImagePlaceholder, { backgroundColor: "#E8F5E8" }]}>
                  <Text style={styles.sliderImageText}>🎯</Text>
                </View>
                <Text style={styles.sliderText}>Khuyến mãi mới</Text>
              </View>
            </ScrollView>
          </View>

          {/* Services Grid */}
          <View style={styles.servicesSection}>
            <Text style={styles.sectionTitle}>Mua sắm - Giải trí - Đầu tư</Text>
            <View style={styles.servicesGridContainer}>
              {serviceGrid.map((service, index) => (
                <TouchableOpacity key={index} style={styles.gridItem}>
                  <View style={[styles.gridIcon, { backgroundColor: service.color }]}>
                    <Text style={styles.gridIconText}>{service.icon}</Text>
                  </View>
                  <Text style={styles.gridText}>{service.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation - Smaller and Sticky */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navText}>Trang chủ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>💳</Text>
            <Text style={styles.navText}>Thẻ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItemCenter}>
            <View style={styles.qrIconContainer}>
              <Text style={styles.qrIcon}>⚏</Text>
            </View>
            <Text style={styles.navText}>QR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>🎁</Text>
            <Text style={styles.navText}>Ưu đãi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>⋯</Text>
            <Text style={styles.navText}>Thêm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerLeft: {},
  mbLogo: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    gap: 15,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  headerIconText: {
    color: "#FFF",
    fontSize: 18,
  },
  loadingArea: {
    position: "absolute",
    top: 90,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1565C0",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for bottom navigation
  },
  balanceSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  userIconSection: {
    alignItems: "center",
  },
  userIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  userIconText: {
    fontSize: 28,
    color: "#FFF",
  },
  nangHangBadge: {
    backgroundColor: "#D4A574",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  nangHangText: {
   color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  balanceCard: {
    width: width * 0.55,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  balanceTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  balanceActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  chevronIcon: {
    color: "#FFF",
    fontSize: 20,
    marginRight: 10,
  },
  eyeButton: {
    padding: 5,
  },
  eyeIcon: {
    color: "#FFF",
    fontSize: 18,
  },
  balanceAmount: {
color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  mainContainer: {
    backgroundColor: "#FFF",
    height: "100%",
    borderRadius: 20,
    
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  mainServices: {
    padding: 20,
    backgroundColor: "#FAFAFA",
    paddingBottom: 30, // Add extra padding at bottom for expand button
  },
  servicesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  serviceItem: {
    alignItems: "center",
    flex: 1,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  serviceIcon: {
    fontSize: 24,
  },
  serviceText: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
  },
  expandButtonContainer: {
    position: "absolute",
    top: 130, // Position it to overlay the border
    alignSelf: "center",
    zIndex: 10,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  expandButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E53E3E",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  expandIcon: {
    color: "#FFF",
    fontSize: 18,
  },
  sliderSection: {
    paddingVertical: 30, // Add more padding at top for expand button
    paddingTop: 40,
    backgroundColor: "#F8F9FA",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    borderTopWidth: 2,
    borderTopColor: "#E5E5E5",
  },
  imageSlider: {
    paddingLeft: 20,
  },
  sliderItem: {
    marginBottom: 4,
    width: width * 0.8,
    marginLeft: 10,
    marginRight: 20,
    backgroundColor: "#FFF",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadow: 4,
    elevation: 3,
  },
  sliderImagePlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  sliderImageText: {
    fontSize: 40,
  },
  sliderText: {
    padding: 15,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  servicesSection: {
    padding: 20,
    backgroundColor: "#FFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  servicesGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "23%",
    alignItems: "center",
    marginBottom: 20,
  },
  gridIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  gridIconText: {
    color: "#FFF",
    fontSize: 20,
  },
  gridText: {
    fontSize: 11,
    textAlign: "center",
    color: "#333",
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 2,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bottomNav: {
    backgroundColor: "#1565C0",
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: width * 0.92,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  navItemCenter: {
    alignItems: "center",
    flex: 1,
  },
  qrIconContainer: {
    backgroundColor: "#E53E3E",
    borderRadius: 15,
    padding: 8,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  qrIcon: {
    color: "#FFF",
    fontSize: 20,
  },
  navIcon: {
    color: "#FFF",
    fontSize: 18,
    marginBottom: 4,
  },
  navText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "500",
  },
})

export default One