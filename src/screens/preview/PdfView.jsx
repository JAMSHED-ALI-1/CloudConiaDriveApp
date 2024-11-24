import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { AppSettings } from '../../utils/Settings';
import { makeApiCall } from '../../helper/apiHelper';
import CustomHeader from '../../components/CustomHeader';
import { COLORS } from '../../utils/Colors';

const PdfView = ({ route }) => {
  const navigation = useNavigation();
  const accesstoken = route.params?.user?.access_token;
  const pdfId = route.params.filePath.id;
  const [previewToken, setPreviewToken] = useState('');
  const [pdfSource, setPdfSource] = useState(null);

  useEffect(() => {
    const fetchPreviewToken = async () => {
      try {
        const token = await makeApiCall(`/api/v1/file-entries/${pdfId}/add-preview-token`, accesstoken, 'post');
        setPreviewToken(token?.preview_token);
      } catch (error) {
        console.log('Error fetching preview token:', error);
      }
    };

    fetchPreviewToken();
  }, [accesstoken, pdfId]);

  useEffect(() => {
    if (previewToken) {
      const pdfUri = route.params.filePath.url; // Use the correct file path
      const previewUrl = `${AppSettings.base_url}${pdfUri}?preview_token=${previewToken}`;
      setPdfSource({ uri: previewUrl });
    }
  }, [previewToken, route.params.filePath.url]);

  const source = pdfSource
    ? Platform.OS === 'android'
      ? { uri: `https://docs.google.com/gview?embedded=true&url=${pdfSource.uri}` }
      : { uri: pdfSource.uri }
    : null;

  return (
    <SafeAreaView style={styles.container}>
   <View style={{paddingHorizontal:10 , justifyContent: 'center',
    alignItems: 'center',}}>

  
      <CustomHeader back={true} left={true} OnPress={() => navigation.goBack()}  title={'PDF Viewer'}/>
      <View style={styles.pdfView}>
        {source ? (
          <WebView
            source={source}
            style={styles.pdf}
            startInLoadingState={true}
            renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
          />
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>
      </View>
    </SafeAreaView>
  );
};

export default PdfView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:COLORS.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    margin: 20,
  },
  pdfView: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
