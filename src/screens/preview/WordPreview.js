import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';
import { makeApiCall } from '../../helper/apiHelper';
import { AppSettings } from '../../utils/Settings';
import CustomHeader from '../../components/CustomHeader';
import { COLORS } from '../../utils/Colors';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

const WordPreview = ({ route }) => {
  const navigation = useNavigation();
  const { user, filePath } = route.params;
  const accesstoken = user?.access_token;
  const wordId = filePath?.id;

  const [previewToken, setPreviewToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const fetchPreviewToken = async () => {
    if (!accesstoken || !wordId) {
      setError('Invalid document credentials');
      setLoading(false);
      return;
    }

    try {
      const response = await makeApiCall(
        `/api/v1/file-entries/${wordId}/add-preview-token`,
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviewToken();
  }, [accesstoken, wordId]);

  useEffect(() => {
    if (previewToken && filePath?.url) {
      const baseUrl = `${AppSettings.base_url}${filePath.url}?preview_token=${previewToken}`;
      setFileUrl(baseUrl);
    }
  }, [previewToken, filePath]);

  const renderLoader = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Loading document...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CustomHeader 
          back={true} 
          left={true} 
          OnPress={() => navigation.goBack()} 
          title="Word Viewer"
        />
        
       
          <WebView
            source={{
              uri: Platform.select({
                ios: fileUrl,
                android: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}`
              })
            }}
            style={styles.webview}
            startInLoadingState={true}
            renderLoading={renderLoader}
            onError={() => setError('Failed to load document preview')}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={true}
            bounces={false}
          />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding:15
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 20
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textColor
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20
  },
  filename: {
    fontSize: 16,
    color: COLORS.textColor,
    marginBottom: 20,
    textAlign: 'center',
    width: '100%'
  },
  openButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    width: '80%',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  openButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600'
  },
  webViewButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    borderWidth: 1,
    borderColor: COLORS.primary
  },
  webViewButtonText: {
    color: COLORS.primary,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600'
  },
  retryButton: {
    width: '50%',
    marginTop: 10
  }
});

export default WordPreview;