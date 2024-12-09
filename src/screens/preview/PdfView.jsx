import React, { useEffect, useState,useCallback } from 'react';
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
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

import CustomHeader from '../../components/CustomHeader';
import { COLORS } from '../../utils/Colors';
import { AppSettings } from '../../utils/Settings';
import { baseURL } from '../../utils/constant/settings';
import { useSelector } from 'react-redux';

const PdfView = ({ route }) => {
  const navigation = useNavigation();
  const workspaces = useSelector(state => state.workspace.workspace);
  const { user, filePath } = route.params;
  const accessToken = user?.access_token;
  const pdfId = filePath.id;

  const [previewToken, setPreviewToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


    const fetchPreviewToken = useCallback(async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${baseURL}/file-entries/${pdfId}/add-preview-token`, 
          {}, 
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            params:{
              workspaceId: workspaces?workspaces:0,
            }
          }
        );
        // console.log(response.data)
        setPreviewToken(response.data.preview_token);
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
    },[accessToken, pdfId, workspaces]);

    useEffect(() => {
      if (accessToken && pdfId) {
        fetchPreviewToken();
      }
    }, [fetchPreviewToken]);

  const getPreviewUrl = useCallback(() => {
    if (!previewToken || !filePath?.url) return null;
    
    const baseUrl = `${AppSettings.base_url}${filePath.url}?preview_token=${previewToken}`;
    
    return Platform.OS === 'android'
      ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(baseUrl)}`
      : baseUrl;
  } , [previewToken, filePath]);

  const handleError = useCallback(() => {
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
              Linking.openURL(url).catch(err => 
                console.error('Error opening URL:', err)
              );
            }
          }
        }
      ]
    );
  }, [getPreviewUrl]);

  const renderLoader = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator 
        size="large" 
        color={COLORS.primaryColor || "#0000ff"} 
      />
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CustomHeader 
          back={true} 
          left={true} 
          OnPress={() => navigation.goBack()}  
          title={'PDF Viewer'}
        />
        <WebView
          source={{ uri: previewUrl }}
          style={styles.webview}
          startInLoadingState={true}
          renderLoading={renderLoader}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onError={handleError}
          onHttpError={handleError}
          originWhitelist={['*']}
          allowsInlineMediaPlayback={true}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    paddingHorizontal: 15,
  },
  webview: {
    flex: 1,
    // height:'100%'
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

export default PdfView;