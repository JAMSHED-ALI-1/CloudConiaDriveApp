import { StatusBar, StyleSheet, View } from 'react-native';
import React from 'react';
import StackNavigation from './src/navigation/StackNavigation';
import FlashMessage from "react-native-flash-message";
const App = () => {
  return (
    <>
      <StatusBar 
        barStyle="light-content"  
        backgroundColor="#0071BC" 
      />
      <View style={styles.container}>
        <StackNavigation />
        <FlashMessage position="top" />
      </View>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
