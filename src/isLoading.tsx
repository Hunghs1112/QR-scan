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
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loader: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
});

export default IsLoading;