// SpreadsheetPreview.js

import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  Linking,
  Platform,
  Alert,
  StyleSheet,
  Text,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { makeApiCall } from '../../helper/apiHelper';
import { AppSettings } from '../../utils/Settings';

const SpreadsheetPreview = ({ accesstoken, filePath }) => {
  const [previewToken, setPreviewToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreviewToken = async () => {
      try {
        setLoading(true);
        const response = await makeApiCall(
          `/api/v1/file-entries/${filePath.id}/add-preview-token`,
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
        Alert.alert('Error', 'Failed to load the spreadsheet. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (accesstoken && filePath) {
      fetchPreviewToken();
    }
  }, [accesstoken, filePath]);

  const getPreviewUrl = () => {
    if (!previewToken || !filePath?.url) return null;

    const baseUrl = `${AppSettings.base_url}${filePath.url}?preview_token=${previewToken}`;

    const fileExtension = filePath.url.split('.').pop().toLowerCase();

    switch (fileExtension) {
      case 'xls':
      case 'xlsx':
      case 'ods':
      case 'csv':
        return Platform.OS === 'android'
          ? `https://docs.google.com/spreadsheets/d/e/2PACX-1vRGeDW7LFcGeG1g1_J2eCjU9pU_bk7Dd5nLCQlRiuyf1EuF70N6TbK9_OcOZdzPgnzAXZ67dG3OE4ap/pub?output=html&url=${encodeURIComponent(baseUrl)}`
          : baseUrl;
      default:
        return null; // or handle unsupported formats
    }
  };

  const handleError = () => {
    Alert.alert(
      'Error',
      'Cannot display the spreadsheet. Would you like to open it in a browser?',
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
        <Text style={styles.errorText}>Invalid spreadsheet URL</Text>
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: previewUrl }}
      style={styles.webview}
      startInLoadingState={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onError={handleError}
      onHttpError={handleError}
    />
  );
};

const styles = StyleSheet.create({
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
  webview: {
    flex: 1,
  },
});

export default SpreadsheetPreview;
