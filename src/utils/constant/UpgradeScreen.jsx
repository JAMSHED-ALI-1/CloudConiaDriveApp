// UpgradeScreen.js
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import CustomHeader from '../../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';

const UpgradeScreen = () => {
    const navigation=useNavigation()
  return (
    <SafeAreaView style={styles.container}>
        <View style={{flex:1,}}>

    
        <CustomHeader back={true} left={true} title={'Pricing List'} OnPress={()=>navigation.goBack()}/>
      <WebView source={{ uri: 'https://coniacloud.com/en/coniacloud-drive/' }} style={{ flex: 1 }} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default UpgradeScreen;
