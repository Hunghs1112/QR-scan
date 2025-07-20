"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  ImageBackground,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Animated,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useAuth } from "./Context/AuthContext"
import { login } from "./apiService" // Adjust the import path

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

const a1Image = require("./image/a1.jpg")
const backgroundImage = require("./image/background.jpg")
const leftLogo = require("./image/mb.png")

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const {
    name,
    setname,
    username,
    setUsername,
    isAuthenticated,
    setIsAuthenticated,
    account_number,
    setAccountNumber,
    balance,
    setBalance,
  } = useAuth()
  const [password, setPassword] = useState<string>("")
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false)
  const [inputPositionY] = useState<Animated.Value>(new Animated.Value(0))

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate("Main")
    }
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true)
      Animated.timing(inputPositionY, {
        toValue: -70,
        duration: 300,
        useNativeDriver: true,
      }).start()
    })

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false)
      Animated.timing(inputPositionY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    })

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [inputPositionY, isAuthenticated, navigation])

  const handleLogin = async (): Promise<void> => {
    if (!username || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập tài khoản và mật khẩu!")
      return
    }
    try {
      console.log("Attempting login with:", { username, password }) // Debug log
      const data = await login({ username, password })
      console.log("Login response:", data) // Debug log
      if (data.success) {
        setname(data.user.name)
        setAccountNumber?.(data.user.account_number)
        setBalance?.(data.user.balance)
        setIsAuthenticated(true)
      } else {
        throw new Error(data.message || "Đăng nhập thất bại")
      }
    } catch (error) {
      console.error("Login error:", error)
      Alert.alert("Lỗi", (error as Error).message || "Đăng nhập thất bại. Vui lòng kiểm tra tài khoản hoặc mật khẩu.")
    }
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Image
          source={{ uri: "https://mbbank.anhwatch.com/wp-content/uploads/2024/09/logo-mb-bank-2.png" }}
          style={styles.rightLogo}
          resizeMode="contain"
        />

        <Animated.View style={[styles.loginCard, { transform: [{ translateY: inputPositionY }] }]}>
          <View style={styles.shieldContainer}>
            <View style={styles.shieldIcon}>
              <Text style={styles.shieldText}>🛡️</Text>
            </View>
          </View>

          <Text style={styles.greetingText}>Xin chào,</Text>

          <View style={styles.usernameContainer}>
            <TextInput
              style={styles.usernameInput}
              placeholder="Nhập Tài khoản"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Mật khẩu"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.actionLinksContainer}>
            <TouchableOpacity>
              <Text style={styles.actionLink}>Tài khoản khác</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.actionLink}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  rightLogo: {
    position: "absolute",
    top: 30,
    right: 10,
    width: 80,
    height: 200,
  },
  loginCard: {
    top: 64,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 24,
    paddingBottom: 0,
    paddingTop: 30,
  },
  greetingText: {
    fontSize: 18,
    color: "#FFF",
    marginBottom: 8,
    fontWeight: "400",
  },
  usernameContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: 20,
  },
  usernameInput: {
    fontSize: 16,
    color: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  passwordContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: 28,
  },
  passwordInput: {
    fontSize: 16,
    color: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  actionLinksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  actionLink: {
    color: "#FFF",
    fontSize: 14,
    opacity: 0.9,
  },
  loginButton: {
    backgroundColor: "#6d7a88",
    borderRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 30,
    marginHorizontal: -24, // Extend to full width of card
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  shieldContainer: {
    marginBottom: 16,
  },
  shieldIcon: {
    position: "relative",
    alignSelf: "flex-start",
  },
  shieldText: {
    fontSize: 24,
    color: "#FFD700",
  },
})

export default LoginScreen
