import {
  AppState,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Image,
} from "react-native"
import { useRef, useState, useEffect } from "react"
import { launchImageLibrary } from "react-native-image-picker"
import { decodeQR } from "../Encoding"
import { scanFromPath } from "react-native-lib-scan-image-code-bank"
import { Camera, useCameraDevice, useCameraFormat, useCodeScanner } from "react-native-vision-camera"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import Icon from "react-native-vector-icons/MaterialIcons"

// Define the navigation stack param list (consistent with Navigation.tsx)
type RootStackParamList = {
  Home: undefined
  Two: undefined
  One: undefined
  three: { bankCode: string; accountNumber: string; recipientName: string }
  QRPage: undefined
  five: {
    accountNumber: string
    transferContent: string
    amount: string
    amountText: string
    recipientAccountNumber: string
    recipientName: string
    bankCode: string
    bankName: string
  }
}

// Define the navigation prop type
type NavigationProp = NativeStackNavigationProp<RootStackParamList>

type Props = {}

// Placeholder QR code images (using local assets)
const qrCodeImages = [
  { id: 1, source: require("../image/qr1.jpg") },
  { id: 2, source: require("../image/qr2.jpg") },
  { id: 3, source: require("../image/qr3.jpg") },
  { id: 4, source: require("../image/qr4.jpg") },
  { id: 5, source: require("../image/qr5.jpg") },
]

const App = (props: Props) => {
  const device = useCameraDevice("back")
  const [checkCamera, setCheckCamera] = useState<boolean>(true)
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false)
  const appState = useRef(AppState.currentState)
  const [appStateStatus, setAppStateStatus] = useState(appState.current)
  const [isScanning, setIsScanning] = useState<boolean>(true)
  const [light, setLight] = useState<boolean>(false)
  const navigation = useNavigation<NavigationProp>()

  const format = useCameraFormat(device, [
    { videoStabilizationMode: "auto" },
    { photoAspectRatio: 4 / 3 },
    { videoAspectRatio: 4 / 3 },
    { photoResolution: "max" },
  ])

  // Trì hoãn hiển thị camera để đảm bảo khởi tạo
  useEffect(() => {
    if (device) {
      const timer = setTimeout(() => {
        setIsCameraReady(true)
        console.log("Camera ready")
      }, 500) // Đợi 500ms để camera khởi tạo
      return () => clearTimeout(timer)
    }
  }, [device])

  // Theo dõi trạng thái ứng dụng
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      console.log("AppState changed:", nextAppState)
      setAppStateStatus(nextAppState)
    })
    setAppStateStatus(AppState.currentState)
    return () => subscription.remove()
  }, [])

  const handleImageSelection = async (usCheckBase64: boolean) => {
    try {
      const response = await launchImageLibrary(optionsImagerLIB)
      console.log("response", response)
      if (response.didCancel) {
        return []
      }
      if (response.errorCode) {
        return []
      }
      if (response?.assets) {
        const selectedImage = response.assets[0]
        const imageUri = selectedImage.uri
        if (Platform.OS === "android" && imageUri) {
          const codes = await scanFromPath(imageUri)
          if (!codes?.length) {
            console.log("Mã QR không hợp lệ!")
            return []
          }
          const parsed = decodeQR(codes[0])
          if (!parsed.valid) {
            console.log(parsed.message)
            return []
          }
          navigation.navigate("three", {
            bankCode: parsed.bankCode || "",
            accountNumber: parsed.accountNumber || "",
            recipientName: "",
          })
          console.log("✅ Mã QR hợp lệ")
          console.log("🔢 BIN:", parsed.bin)
          console.log("🌐 Quốc gia:", parsed.nation)
          console.log("🏦 Ngân hàng:", parsed.bankName)
          console.log("🔤 Bank code:", parsed.bankCode)
          console.log("🔢 Số tài khoản:", parsed.accountNumber)
          console.log("👤 Tên người nhận:", parsed.merchantName)
          console.log("💰 Số tiền:", parsed.amount ? parsed.amount + " VND" : "Không có")
        } else if (Platform.OS === "ios" && imageUri) {
          console.log("imageUri", imageUri)
          const codes = await scanFromPath(imageUri)
          if (!codes?.length) {
            console.log("Mã QR không hợp lệ!")
            return []
          }
          const parsed = decodeQR(codes[0])
          if (!parsed.valid) {
            console.log(parsed.message)
            return []
          }
          navigation.navigate("three", {
            bankCode: parsed.bankCode || "",
            accountNumber: parsed.accountNumber || "",
            recipientName: "",
          })
          console.log("✅ Mã QR hợp lệ")
          console.log("🔢 BIN:", parsed.bin)
          console.log("🌐 Quốc gia:", parsed.nation)
          console.log("🏦 Ngân hàng:", parsed.bankName)
          console.log("🔤 Bank code:", parsed.bankCode)
          console.log("🔢 Số tài khoản:", parsed.accountNumber)
          console.log("👤 Tên người nhận:", parsed.merchantName)
          console.log("💰 Số tiền:", parsed.amount ? parsed.amount + " VND" : "Không có")
        }
      }
    } catch (error) {
      console.log("Error in handleImageSelection:", error)
    }
  }

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: async (codes: any) => {
      if (!isScanning) {
        return
      }
      const firstCode = codes[0]
      const codeValue = firstCode?.value
      if (codeValue) {
        try {
          const parsed = decodeQR(codeValue)
          setIsScanning(false)
          console.log("✅ Mã QR hợp lệ")
          console.log("🔢 BIN:", parsed.bin)
          console.log("🌐 Quốc gia:", parsed.nation)
          console.log("🏦 Ngân hàng:", parsed.bankName)
          console.log("🔤 Bank code:", parsed.bankCode)
          console.log("🔢 Số tài khoản:", parsed.accountNumber)
          console.log("👤 Tên người nhận:", parsed.merchantName)
          console.log("💰 Số tiền:", parsed.amount ? parsed.amount + " VND" : "Không có")
          navigation.navigate("three", {
            bankCode: parsed.bankCode || "",
            accountNumber: parsed.accountNumber || "",
            recipientName: "",
          })
        } catch (error) {
          setIsScanning(true)
        }
      }
    },
  })

  // ===== COMPLETELY NEW SMOOTH INFINITE CAROUSEL LOGIC =====
  const translateX = useRef(new Animated.Value(0)).current
  const itemWidth = 92 // 80px width + 12px margin
  const COPIES_COUNT = 50
  const infiniteImages = Array(COPIES_COUNT).fill(qrCodeImages).flat()
  const totalWidth = infiniteImages.length * itemWidth

  useEffect(() => {
    const infiniteAnimation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -totalWidth,
        duration: infiniteImages.length * 1200,
        useNativeDriver: true,
      }),
      { iterations: -1 }
    )
    infiniteAnimation.start()
    return () => infiniteAnimation.stop()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quét mã QR</Text>
        </View>
        <View style={styles.avatarPlaceholder}>
          <Image
            source={require('../image/den.png')}
            style={styles.buttonImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Camera Frame */}
      {device && checkCamera && isCameraReady ? (
        <View style={styles.cameraWrapper}>
          <Camera
            style={styles.camera}
            device={device}
            isActive={appStateStatus === "active"}
            enableZoomGesture
            {...props}
            codeScanner={codeScanner}
            torch={light ? "on" : "off"}
            fps={30}
            photoQualityBalance="speed"
            format={format}
            onError={(error) => console.log("Camera error:", error)}
          />
         
        </View>
      ) : (
        <View style={styles.cameraWrapper}>
          <Text style={styles.cameraPlaceholderText}>Đang tải camera...</Text>
        </View>
      )}

      {/* QR Code Types (Pure Infinite Carousel) */}
      <Text style={styles.qrCodeLabel}>Chấp nhận mã QR:</Text>
      <View style={styles.qrCodeContainer}>
        <View style={styles.qrCodeScroll}>
          <Animated.View style={[styles.qrCodeWrapper, { transform: [{ translateX }] }]}>
            {infiniteImages.map((item, index) => (
              <View key={`infinite-${index}`} style={styles.qrCodeItem}>
                <Image source={item.source} style={styles.qrCodeImage} />
              </View>
            ))}
          </Animated.View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button}>
            <Image
              source={require('../image/nutqr.png')}
              style={styles.buttonImage1}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.buttonLabel}>QR của tôi</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button} onPress={() => handleImageSelection(false)}>
            <Image
              source={require('../image/nutanh.png')}
              style={styles.buttonImage1}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.buttonLabel}>Tải ảnh lên</Text>
        </View>
      </View>

      {/* Retry Button */}
      {!isScanning && (
        <View style={styles.retryWrapper}>
          <TouchableOpacity style={styles.retryButton} onPress={() => setIsScanning(true)}>
            <Text style={styles.retryText}>Quét lại</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: "#040404", // Light gray background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 30,
    
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  icon: {
    color: "#fff",
    fontSize: 24,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraWrapper: {
    width: "100%",
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#97c1d6",
    aspectRatio: 3 / 4,
    alignSelf: "center",
    flex: 0,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20,
    zIndex: 1, // Đảm bảo overlay ở trên cùng nhưng không che camera
  },
  cameraPlaceholderText: {
    color: "rgba(255, 255, 255, 1)",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  qrCodeLabel: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 18,
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  qrCodeContainer: {
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  qrCodeScroll: {
    height: 120,
  },
  qrCodeWrapper: {
    flexDirection: "row",
  },
  qrCodeItem: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: "#fff",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  qrCodeImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    resizeMode: "contain",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 6,
  },
  buttonWrapper: {
    alignItems: "center",
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 1)",
    backgroundColor: "rgba(212,223,243,255)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  buttonImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  buttonImage1: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  retryWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 15,
  },
})

export const optionsImagerLIB: any = {
  selectionLimit: 1, // Giới hạn 1 ảnh để giảm tải
  mediaType: "photo",
  maxWidth: 800, // Giảm độ phân giải ảnh
  maxHeight: 800, // Giảm kích thước ảnh để tăng tốc xử lý
  includeBase64: false, // Không chuyển đổi Base64 để tiết kiệm bộ nhớ
}