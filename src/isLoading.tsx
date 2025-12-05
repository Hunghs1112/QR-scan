import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface IsLoadingProps {
  visible?: boolean;
}

const IsLoading: React.FC<IsLoadingProps> = ({ visible = false }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)', // Opacity đổi thành 0.8
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loader: {
    backgroundColor: 'black', // Khung đổi từ trắng thành đen
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
});

export default IsLoading;