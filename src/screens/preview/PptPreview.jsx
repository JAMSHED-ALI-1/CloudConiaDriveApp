import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Linking,
  Platform,
  Alert,
  SafeAreaView,
  Text
} from 'react-native';
import { WebView } from 'react-native-webview';
import { makeApiCall } from '../../helper/apiHelper';
import { AppSettings } from '../../utils/Settings';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';
import { COLORS } from '../../utils/Colors';

const PptPreview = ({ route }) => {
  const navigation = useNavigation();
  const { user, filePath } = route.params;
  const accesstoken = user?.access_token;
  const pdfId = filePath.id;

  const [previewToken, setPreviewToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreviewToken = async () => {
      try {
        setLoading(true);
        const response = await makeApiCall(
          `/api/v1/file-entries/${pdfId}/add-preview-token`,
          accesstoken,
          'post'
        );
        
        if (!response?.preview_token) {
          throw new Error('Preview token not received');
        }
        
        setPreviewToken(response.preview_token);
      } catch (error) {
        console.error('Error fetching preview token:', error);
        setError('Failed to load preview token');
        Alert.alert(
          'Error',
          'Failed to load the presentation. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (accesstoken && pdfId) {
      fetchPreviewToken();
    }
  }, [accesstoken, pdfId]);

  const getPreviewUrl = () => {
    if (!previewToken || !filePath?.url) return null;
    
    const baseUrl = `${AppSettings.base_url}${filePath.url}?preview_token=${previewToken}`;
    
    return Platform.OS === 'android'
      ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(baseUrl)}`
      : baseUrl;
  };

  const handleError = () => {
    Alert.alert(
      'Error',
      'Cannot display the presentation. Would you like to open it in browser?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Open in Browser',
          onPress: () => {
            const url = getPreviewUrl();
            if (url) {
              Linking.openURL(url);
            }
          }
        }
      ]
    );
  };

  const renderLoader = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  if (loading) {
    return renderLoader();
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const previewUrl = getPreviewUrl();
  if (!previewUrl) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Invalid presentation URL</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex:1,backgroundColor:COLORS.backgroundColor}}>
  <View style={styles.container}>
         <CustomHeader back={true} left={true} OnPress={() => navigation.goBack()}  title={'PPT Viewer'}/>
      <WebView
        source={{ uri: previewUrl }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={renderLoader}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onError={handleError}
        onHttpError={handleError}
      />
    </View>
    </SafeAreaView>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal:15
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default PptPreview;
