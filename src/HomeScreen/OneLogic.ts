import { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { useAuth } from '../Context/AuthContext';
import { useUser } from '../Context/UserContext';
import { checkBalance, getUserImage } from '../utils/apiService';

export const useOneLogic = () => {
  const { account_number, setBalance, balance, isAuthenticated } = useAuth();
  const { setUserImage } = useUser();
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showLoadingArea, setShowLoadingArea] = useState<boolean>(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;

  const formatVND = (amount: number): string => {
    if (isNaN(amount) || amount === 0) {
      return '0';
    }
    const numStr = Math.floor(amount).toString();
    let result = '';
    for (let i = numStr.length - 1, count = 0; i >= 0; i--) {
      result = numStr[i] + result;
      count++;
      if (count % 3 === 0 && i > 0) {
        result = ',' + result;
      }
    }
    return result;
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (isAuthenticated && account_number) {
        try {
          const response = await checkBalance(account_number);
          if (response.success && setBalance) {
            setBalance(response.balance / 100);
          }
        } catch (error) {
        }
      }
    };
    fetchBalance();
  }, [account_number, setBalance, isAuthenticated]);

  const handleEyeClick = async () => {
    setIsBalanceVisible(!isBalanceVisible);
    if (!isBalanceVisible && isAuthenticated && account_number) {
      try {
        const response = await checkBalance(account_number);
        if (response.success && setBalance) {
          setBalance(response.balance / 100);
        }
      } catch (error) {
      }
    }
  };

  const handleRefresh = async () => {
    if (!isAuthenticated || !account_number) {
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    try {
      const balanceResponse = await checkBalance(account_number);
      if (balanceResponse.success && setBalance) {
        setBalance(balanceResponse.balance / 100);
      }

      const imageResponse = await getUserImage(account_number);
      if (imageResponse.success && imageResponse.user?.image) {
        const imageUrl = imageResponse.user.image.startsWith('http')
          ? imageResponse.user.image
          : `http://51.79.181.161:5000${imageResponse.user.image}`;
        setUserImage(imageUrl);
      } else {
        setUserImage(null);
      }
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
    if (offsetY < -50 && !showLoadingArea) {
      setShowLoadingArea(true);
      Animated.timing(loadingOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else if (offsetY >= -10 && showLoadingArea) {
      Animated.timing(loadingOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setShowLoadingArea(false));
    }
  };

  return {
    balance,
    isBalanceVisible,
    refreshing,
    showLoadingArea,
    loadingOpacity,
    scrollY,
    handleEyeClick,
    handleRefresh,
    handleScroll,
    formatVND,
  };
};