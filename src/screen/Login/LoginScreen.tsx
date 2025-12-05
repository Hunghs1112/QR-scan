import React from "react";
import { SafeAreaView, ImageBackground, View } from "react-native";
import { styles } from "./styles";
import { IMAGES } from "./constants";
import { Header } from "./Header";
import { LoginCard } from "./LoginCard";
import { Features } from "./Features";
import { Footer } from "./Footer";

const LoginScreen: React.FC = () => {
  return (
    <ImageBackground source={IMAGES.background} style={styles.background} >
      {/* Dùng View thường ở ngoài để background phủ toàn bộ */}
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <LoginCard />
        <Features />
        <Footer />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;
