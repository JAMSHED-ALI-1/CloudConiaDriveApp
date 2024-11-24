import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../../utils/Colors'
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';

const Zipapkpreview = () => {
    const navigation = useNavigation();
  const { user, filePath } = route.params;
  const accesstoken = user?.access_token;
    const handleFileOpen = (url) => {
        Linking.openURL(url).catch((err) => {
          console.error("Failed to open URL:", err);
          Alert.alert('Error', 'Unable to open the file. Please try again later.');
        });
      };
  return (
    <SafeAreaView style={styles.container}>
   <CustomHeader back={true} left={true} OnPress={() => navigation.goBack()}  />

    <View style={styles.containerinner}>
    <View style={styles.errorContainer}>
          <Text style={styles.errorText}>This is a ZIP file. It cannot be previewed directly.</Text>
          <Text style={styles.infoText} onPress={() => handleFileOpen(filePath.url)}>Download ZIP</Text>
        </View>
    </View>
    </SafeAreaView>
  )
}

export default Zipapkpreview

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:COLORS.white
    },
    containerinner:{
        flex:1,
       padding:15
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      errorText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16,
      },
      infoText: {
        color: '#007BFF',
        textDecorationLine: 'underline',
        fontSize: 16,
        marginTop: 10,
      },
})