import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Keyboard, Animated, Alert } from "react-native";
import PushNotification from "react-native-push-notification";
import NotifService from "../../utils/NotifService";
import { useAuth } from "../../Context/AuthContext";
import { login } from "../../utils/apiService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NavigationProp } from "./types";

export const useLoginLogic = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    name,
    setname,
    username,
    setUsername,
    setPassword,
    isAuthenticated,
    setIsAuthenticated,
    account_number,
    setAccountNumber,
    balance,
    setBalance,
    isLoading: authLoading,
    logout: authLogout,
  } = useAuth();
  const [password, setLocalPassword] = useState<string>("");
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [inputPositionY] = useState<Animated.Value>(new Animated.Value(0));

  useEffect(() => {
    console.log("useLoginLogic: Checking authentication state:", { isAuthenticated, authLoading });
    if (!authLoading && isAuthenticated) {
      console.log("useLoginLogic: User authenticated, navigating to Main");
      navigation.navigate("Main");
    }

    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      console.log("useLoginLogic: Keyboard shown");
      setKeyboardVisible(true);
      Animated.timing(inputPositionY, {
        toValue: -70,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      console.log("useLoginLogic: Keyboard hidden");
      setKeyboardVisible(false);
      Animated.timing(inputPositionY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      console.log("useLoginLogic: Cleaning up keyboard listeners");
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [inputPositionY, isAuthenticated, authLoading, navigation]);

  const handleLogin = async (): Promise<void> => {
    if (!username || !password) {
      console.log("useLoginLogic: Login attempt failed: Missing username or password", { username, password });
      Alert.alert("Lỗi", "Vui lòng nhập tài khoản và mật khẩu!");
      return;
    }
    try {
      console.log("useLoginLogic: Attempting login with:", { username, password });
      const data = await login({ username, password });
      console.log("useLoginLogic: Login response:", {
        success: data.success,
        user: data.user ? { name: data.user.name, account_number: data.user.account_number, balance: data.user.balance, image: data.user.image } : null,
        message: data.message,
      });
      if (data.success) {
        setname(data.user.name || "");
        setAccountNumber?.(data.user.account_number || undefined);
        setBalance?.(data.user.balance || undefined);
        setIsAuthenticated(true);
        setUsername(username);
        setPassword(password);
        console.log("useLoginLogic: Login successful, updating auth state:", {
          username,
          password,
          name: data.user.name,
          account_number: data.user.account_number,
          balance: data.user.balance !== undefined ? data.user.balance / 100 : undefined,
          isAuthenticated: true,
        });

        const authData = {
          username,
          password,
          name: data.user.name || "",
          account_number: data.user.account_number || undefined,
          balance: data.user.balance !== undefined ? data.user.balance / 100 : undefined,
          isAuthenticated: true,
        };
        await AsyncStorage.setItem("authData", JSON.stringify(authData));
        console.log("useLoginLogic: Saved auth data to AsyncStorage:", authData);

        const storedAuth = await AsyncStorage.getItem("authData");
        console.log("useLoginLogic: AsyncStorage after login:", storedAuth ? JSON.parse(storedAuth) : null);

        console.log("useLoginLogic: Configuring push notification for token retrieval");
        PushNotification.configure({
          onRegister: async (token) => {
            console.log("useLoginLogic: Push notification token received:", token);
            await NotifService.sendTokenToServer(token.token, {
              isAuthenticated: true,
              username,
            });
          },
          onRegistrationError: (err) => {
            console.error("useLoginLogic: Token registration error:", err.message, err);
          },
          permissions: {
            alert: true,
            badge: true,
            sound: true,
          },
          popInitialNotification: true,
          requestPermissions: false,
        });

        console.log("useLoginLogic: Requesting push notification permissions");
        try {
          const permissionResult = PushNotification.requestPermissions?.();
          if (permissionResult && typeof permissionResult.then === "function") {
            permissionResult
              .then((result) => {
                console.log("useLoginLogic: Permission request result:", result);
              })
              .catch((error) => {
                console.error("useLoginLogic: Permission request error:", error);
              });
          } else {
            console.log("useLoginLogic: requestPermissions is not a Promise or not available.");
          }
        } catch (error) {
          console.error("useLoginLogic: Error requesting permissions:", error);
        }

        console.log("useLoginLogic: Navigating to Main");
        navigation.navigate("Main");
      } else {
        throw new Error(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("useLoginLogic: Login error:", error);
      Alert.alert(
        "Lỗi",
        (error as Error).message || "Đăng nhập thất bại. Vui lòng kiểm tra tài khoản hoặc mật khẩu."
      );
    }
  };

  const logout = async () => {
    console.log("useLoginLogic: Initiating logout");
    await authLogout();
    setLocalPassword("");
  };

  return {
    username,
    setUsername,
    password,
    setLocalPassword,
    inputPositionY,
    handleLogin,
    logout,
  };
};