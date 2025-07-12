/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { NativeModules, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { multiply } from './modules/lib-scan-image-code-bank/src';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const result = multiply(2, 3);
  console.log("multiplys", result);

  // const resultsubtract = subtract(10, 2);
  // console.log("resultsubtract", resultsubtract);



  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NewAppScreen templateFileName="App.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
