import React from "react";
import { View, Text, TextInput, TouchableOpacity, Animated, Image } from "react-native";
import { styles } from "./styles";
import { IMAGES } from "./constants";
import { useLoginLogic } from "./useLoginLogic";

export const LoginCard: React.FC = () => {
  const { username, setUsername, password, setLocalPassword, inputPositionY, handleLogin } = useLoginLogic();

  return (
    <View style={styles.loginCardContainer}>
      <Animated.View style={[styles.loginCard, { transform: [{ translateY: inputPositionY }] }]}>
        <View style={styles.shieldContainer}>
          <View style={styles.shieldIcon}>
            <Image source={IMAGES.shield} style={styles.shieldIconImage} />
          </View>
        </View>
        <Text style={styles.greetingText}>Xin chào,</Text>
        <View style={styles.usernameContainer}>
          <TextInput
            style={styles.usernameInput}
            placeholder="Nhập Tài khoản"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={username}
            onChangeText={(text) => {
              console.log("LoginCard: Username input changed:", text);
              setUsername(text);
            }}
          />
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Mật khẩu"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              console.log("LoginCard: Password input changed:", text);
              setLocalPassword(text);
            }}
          />
        </View>
        <View style={styles.actionLinksContainer}>
          <TouchableOpacity onPress={async () => {
            console.log("LoginCard: Switching to another account, clearing auth data");
            await useLoginLogic().logout();
            setUsername("");
            setLocalPassword("");
          }}>
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