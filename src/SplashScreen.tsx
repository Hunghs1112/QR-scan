import React, { useEffect } from 'react';
import { SafeAreaView, ImageBackground, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from './Context/AuthContext';

// Define RootStackParamList within the file
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Home: undefined;
  Payment: undefined;
  Bank: undefined;
  QRPage: undefined;
  Bill: undefined;
  Confirm: { success?: boolean };
  History: undefined;
  FaceScan: undefined;
  SplashScreen: undefined;
};

// Define NavigationProp type using NativeStackNavigationProp
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
  },
});

const SplashScreen: React.FC = () => {
  const { username, name, isLoading } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const navigateBasedOnAuth = () => {
      if (!isLoading) {
        if (username && name) {
          console.log('SplashScreen: User authenticated, navigating to Main');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        } else {
          console.log('SplashScreen: User not authenticated, navigating to Login');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      }
    };

    // Delay navigation to show splash screen for at least 1 second
    const timer = setTimeout(() => {
      console.log('SplashScreen: Checking auth state:', { isLoading, username, name });
      navigateBasedOnAuth();
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoading, username, name, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('./screen/image/backx.png')} style={styles.background}>
        <Image source={require('./screen/image/logoP.png')} style={styles.logo} />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SplashScreen;