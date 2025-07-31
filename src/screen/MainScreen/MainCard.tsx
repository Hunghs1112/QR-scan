import React from "react";
import { View, Text, TextInput, TouchableOpacity, Animated, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";
import { IMAGES } from "./constants";
import { useMainLogic } from "./useMainLogic";
import { useAuth } from "../../Context/AuthContext";
import type { NavigationProp } from "./types";

export const MainCard: React.FC = () => {
  const { name, localPassword, setLocalPassword, inputPositionY, handleLogin } = useMainLogic();
  const { logout } = useAuth(); // Lấy hàm logout từ AuthContext
  const navigation = useNavigation<NavigationProp>(); // Lấy navigation để điều hướng

  // Hàm xử lý chia tên thành 2 dòng
  const formatName = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length === 4) {
      // Nếu có đúng 4 từ, chia 2 từ đầu cho dòng trên, 2 từ sau cho dòng dưới
      const firstLine = words.slice(0, 2).join(' ');
      const secondLine = words.slice(2).join(' ');
      return { firstLine, secondLine };
    } else if (words.length >= 3) {
      // Nếu có 3 từ hoặc nhiều hơn (ngoài trường hợp 4 từ), lấy từ đầu tiên cho dòng trên
      const firstLine = words[0];
      const secondLine = words.slice(1).join(' ');
      return { firstLine, secondLine };
    }
    // Nếu có 1 hoặc 2 từ, chia như trước
    return { firstLine: words[0] || '', secondLine: words.slice(1).join(' ') || '' };
  };

  const { firstLine, secondLine } = formatName(name || "User Name");

  // Hàm xử lý khi nhấn "Tài khoản khác"
  const handleOtherAccount = async () => {
    try {
      await logout(); // Gọi hàm logout từ AuthContext
      navigation.navigate("Login"); // Điều hướng về màn hình Login
    } catch (error) {
      console.error("MainCard: Failed to logout:", error);
    }
  };

  return (
    <View style={styles.loginCardContainer}>
      <Animated.View style={[styles.loginCard, { transform: [{ translateY: inputPositionY }] }]}>
        <View style={styles.shieldContainer}>
          <View style={styles.shieldIcon}>
            <Image source={IMAGES.shield} style={styles.shieldIconImage} />
          </View>
        </View>
        <Text style={styles.greetingText}>Xin chào,</Text>
        <View style={styles.userNameRow}>
          <View style={styles.userNameContainer}>
            <Text style={styles.userName}>
              {firstLine}
              {secondLine ? '\n' + secondLine : ''}
            </Text>
          </View>
          <TouchableOpacity style={styles.faceIdButton}>
            <Image source={IMAGES.face} style={styles.iconImage} />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Mật khẩu"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            secureTextEntry
            value={localPassword}
            onChangeText={setLocalPassword}
          />
        </View>
        <View style={styles.actionLinksContainer}>
          <TouchableOpacity onPress={handleOtherAccount}>
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
  );
};