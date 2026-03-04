import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import Header from './Header';
import TransferSection from './TransferSection';
import RecentSection from './RecentSection';
import TabSection from './TabSection';
import styles from './styles';

const Two = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <Header />
        <TransferSection />
        <RecentSection />
        <TabSection />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Two;