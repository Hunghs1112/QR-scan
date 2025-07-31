import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Keyboard, Animated } from "react-native";
import { useAuth } from "../../Context/AuthContext";
import type { NavigationProp } from "./types";

export const useMainLogic = () => {
  const navigation = useNavigation<NavigationProp>();
  const { name, username, isAuthenticated, setIsAuthenticated, isLoading } = useAuth();
  const [localPassword, setLocalPassword] = useState<string>("");
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [inputPositionY] = useState<Animated.Value>(new Animated.Value(0));

  useEffect(() => {
    console.log("useMainLogic: Checking auth state:", { isAuthenticated, isLoading, username, name });
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      console.log("useMainLogic: Keyboard shown");
      setKeyboardVisible(true);
      Animated.timing(inputPositionY, {
        toValue: -70,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      console.log("useMainLogic: Keyboard hidden");
      setKeyboardVisible(false);
      Animated.timing(inputPositionY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      console.log("useMainLogic: Cleaning up keyboard listeners");
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [inputPositionY]);

  useEffect(() => {
    if (!isLoading) {
      console.log("useMainLogic: Auth state resolved, navigating based on isAuthenticated:", isAuthenticated);
      if (isAuthenticated) {
        navigation.navigate("Main");
      } else {
        navigation.navigate("Login");
      }
    }
  }, [isAuthenticated, isLoading, navigation]);

  const handleLogin = (): void => {
    console.log("useMainLogic: handleLogin called, navigating to Home");
    navigation.navigate("Home");
  };

  return {
    localPassword,
    setLocalPassword,
    inputPositionY,
    handleLogin,
    name,
  };
};