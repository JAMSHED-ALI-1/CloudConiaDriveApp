// UpgradeScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView ,ActivityIndicator} from 'react-native';
import { WebView } from 'react-native-webview';
import CustomHeader from '../../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';

const UpgradeScreen = () => {
    const navigation=useNavigation()
    const [loading,setloading]=useState(true)

  return (
    <SafeAreaView style={styles.container}>
        <View style={{flex:1,}}>
          <View style={{paddingHorizontal:10}}>

        <CustomHeader back={true} left={true} title={'Pricing List'} OnPress={()=>navigation.goBack()}/>
          </View>
    {loading &&(
      <ActivityIndicator
      style={styles.activityIndicator}
      size="large"
            color="#007aff"

      />
    )}

      <WebView source={{ uri: 'https://coniacloud.com/en/coniacloud-drive/' }} style={{ flex: 1 }} 
       onLoadStart={() => setloading(true)} // Show loader when starting
       onLoadEnd={() => setloading(false)} />
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
