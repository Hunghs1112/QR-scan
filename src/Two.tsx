import React from 'react';
import { View, StyleSheet, ImageBackground, Image, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the navigation stack param list
type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Home: undefined;
  Payment: undefined;
  Bank: undefined;
  QRPage: undefined;
  Bill: undefined;
  Confirm: undefined;
};

// Define the navigation prop type
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Two = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ImageBackground source={require('./image/two.jpg')} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <Image
            source={{ uri: 'https://img.icons8.com/ios-filled/50/ffffff/back.png' }}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Bank')}>
          <Image source={require('./image/stk.png')} style={styles.overlayImage} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('QRPage')}
          style={styles.qrButton}
        >
          <Text style={styles.qrButtonText}>QR Scan</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    top: 2,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayImage: {
    width: 138,
    height: 140,
    resizeMode: 'contain',
    position: 'absolute',
    top: -285,
    left: -201,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },
  qrButton: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20, // Changed to make the button circular
    borderWidth: 1,
    borderColor: 'red', // Matches the blue color used in other screens
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 103,
    left: 353, // Positioned near stk.png without overlap
  },
  qrButtonText: {
    color: '#141ED2',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Two;