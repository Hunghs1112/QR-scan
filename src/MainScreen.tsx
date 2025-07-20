"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, ImageBackground, TextInput, TouchableOpacity, StyleSheet, Keyboard, Animated } from "react-native"
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

const backgroundImage = require("./image/background.jpg")

const MainScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const { name, username, isAuthenticated, setIsAuthenticated } = useAuth()
  const [password, setPassword] = useState<string>("")
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false)
  const [inputPositionY] = useState<Animated.Value>(new Animated.Value(0))

  useEffect(() => {
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
  }, [inputPositionY])

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate("Login")
    }
  }, [isAuthenticated, navigation])

  const handleLogin = (): void => {
    navigation.navigate("Home")
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Animated.View style={[styles.loginCard, { transform: [{ translateY: inputPositionY }] }]}>
          <View style={styles.shieldContainer}>
            <View style={styles.shieldIcon}>
              <Text style={styles.shieldText}>🛡️</Text>
            </View>
          </View>
          <Text style={styles.greetingText}>Xin chào,</Text>
          <View style={styles.userNameRow}>
            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>{name || "User Name"}</Text>
            </View>
            <TouchableOpacity style={styles.faceIdButton}>
              <Text style={styles.faceIdIcon}>👤</Text>
            </TouchableOpacity>
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
  userNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  userNameContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 32,
    color: "#FFF",
    fontWeight: "300",
    lineHeight: 40,
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
  faceIdButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  faceIdIcon: {
    fontSize: 24,
    color: "#FFF",
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
  badgeContainer: {
    position: "absolute",
    top: -2,
    right: -8,
    backgroundColor: "#FFD700",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#1565C0",
    fontSize: 12,
    fontWeight: "bold",
  },
})

export default MainScreen
