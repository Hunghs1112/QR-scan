import React from 'react';
import { SafeAreaView, ImageBackground, ScrollView } from 'react-native';
import Header from './Header';
import TransferSection from './TransferSection';
import RecentSection from './RecentSection';
import TabSection from './TabSection';
import styles from './styles';

const Two = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={require('../screen/image/whiteback.png')} style={styles.background}>
        <ScrollView style={styles.scrollView}>
          <Header />
          <TransferSection />
          <RecentSection />
          <TabSection />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Two;