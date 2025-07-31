import React from "react";
import { SafeAreaView, ImageBackground } from "react-native";
import { styles } from "./styles";
import { IMAGES } from "./constants";
import { Header } from "./Header";
import { MainCard } from "./MainCard";
import { Features } from "./Features";
import { Footer } from "./Footer";

const MainScreen: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={IMAGES.background} style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <Header />
          <MainCard />
          <Features />
          <Footer />
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default MainScreen;