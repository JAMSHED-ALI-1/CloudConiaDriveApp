import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import StackNavigation from './src/navigation/StackNavigation';
import FlashMessage from "react-native-flash-message";
import { useSelector } from 'react-redux';
import { APIServiceProvider } from './src/context/APIServiceContext';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from './src/utils/Colors';

if (__DEV__) {
  require("./ReactotronConfig");
}

const App = () => {

 
  return (
    <>
    
    <NavigationContainer> 
      <APIServiceProvider>
        <View style={styles.container}>
        <StatusBar barStyle="light-content"   backgroundColor={COLORS.blue}/>
          <StackNavigation />
          {/* <Mainstack/> */}
          <FlashMessage position="top" />
        </View>
      </APIServiceProvider>
    </NavigationContainer>
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
