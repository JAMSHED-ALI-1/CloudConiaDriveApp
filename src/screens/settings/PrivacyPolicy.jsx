// UpgradeScreen.js
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import CustomHeader from '../../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';

const PrivacyPolicy = () => {
    const navigation=useNavigation()
  return (
    <SafeAreaView style={styles.container}>
        <View style={{flex:1,}}>

    
        <CustomHeader back={true} left={true} title={'Privacy Policy'} OnPress={()=>navigation.goBack()}/>
      <WebView source={{ uri: 'https://coniasoft.com/en/privacy-policy/' }} style={{ flex: 1 }} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});



export default PrivacyPolicy

