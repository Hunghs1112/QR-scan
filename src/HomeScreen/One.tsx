import React from "react";
import { SafeAreaView, ImageBackground } from "react-native";
import { styles } from "./styles";
import { IMAGES } from "./constants";
import { Header } from "./Header";
import { ScrollContent } from "./ScrollContent";
import { Sticky } from "./Sticky";
import { useOneLogic } from "./OneLogic";

const One: React.FC = () => {
  const {
    balance,
    isBalanceVisible,
    refreshing,
    showLoadingArea,
    loadingOpacity,
    handleEyeClick,
    handleRefresh,
    handleScroll,
    formatVND,
  } = useOneLogic();

  return (
     <ImageBackground source={IMAGES.background} style={styles.background}>
    <SafeAreaView style={{ flex: 1 }}>
     
        <Header />
        <ScrollContent
          refreshing={refreshing}
          handleRefresh={handleRefresh}
          handleScroll={handleScroll}
          balance={balance}
          isBalanceVisible={isBalanceVisible}
          handleEyeClick={handleEyeClick}
          formatVND={formatVND}
          showLoadingArea={showLoadingArea}
          loadingOpacity={loadingOpacity}
        />
        <Sticky />
     
    </SafeAreaView>
     </ImageBackground>
  );
};

export default One;